import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    SocketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
