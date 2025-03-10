import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { InfluxdbModule } from '../influxdb/influxdb.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    InfluxdbModule,
    FirebaseModule,
    SocketModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ || 'amqp://admin:thanesmail1234@siamatic.co.th:5672'],
          queue: 'backup_queue',
          queueOptions: { durable: true }
        }
      }
    ])
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService]
})
export class ConsumerModule {}
