import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from './consumer/consumer.module';
import { JsonLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLogger(),
  });
  
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(ConsumerModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ],
      queue: 'templog_queue',
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1
    },
    logger: new JsonLogger(),
  });
  
  await microservice.listen();
  await app.listen(3000);
}
bootstrap();