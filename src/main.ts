import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from './consumer/consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(ConsumerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ],
      queue: 'templog_queue',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1
    },
  });
  await microservice.listen();
  await app.listen(3000);
}
bootstrap();