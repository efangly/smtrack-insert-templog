import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InfluxdbService } from '../influxdb/influxdb.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTemplogDto } from '../dto/insert.dto';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly influxdb: InfluxdbService,
    private readonly firebase: FirebaseService
  ) {}
  async createTemplog(message: CreateTemplogDto) {
    const log = await this.prisma.tempLogs.create({
      data: message,
      include: { device: true }
    });
    const tags = { sn: message.mcuId, probe: message.probe };
    if (message.isAlert) {
      const fields = { message: message.message };
      await this.influxdb.writeData('templog-alert', fields, tags);
      await this.firebase.pushNotification('admin', log.device.name, message.message);
    } else {
      const fields = {
        temp: message.tempValue,
        internet: message.internet,
        plug: message.plugin,
        door: message.door
      };
      await this.influxdb.writeData('templog', fields, tags);
    }
  }
}