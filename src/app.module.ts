import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { InfluxdbModule } from './influxdb/influxdb.module';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, PrismaModule, InfluxdbModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
