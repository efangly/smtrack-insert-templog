import { Module } from '@nestjs/common';
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
    SocketModule
  ],
  controllers: [ConsumerController],
  providers: [ConsumerService]
})
export class ConsumerModule {}
