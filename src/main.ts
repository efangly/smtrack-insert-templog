import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ],
      queue: process.env.NODE_ENV === "production" ? 'templog' : 'templog-test',
      queueOptions: { durable: true },
      prefetchCount: 10,
      noAck: false
    },
  });
  await microservice.listen();
  await app.listen(3000);
}
bootstrap();