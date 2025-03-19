import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { InfluxdbService } from '../influxdb/influxdb.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateTemplogDto } from '../dto/insert.dto';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class ConsumerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly prisma: PrismaService,
    private readonly influxdb: InfluxdbService,
    private readonly firebase: FirebaseService,
    private readonly socket: SocketService
  ) {}
  async createTemplog(message: CreateTemplogDto) {
    const log = await this.prisma.tempLogs.create({ data: message, include: { device: true } });
    this.client.emit('templog-backup', {
      id: log.id,
      mcuId: log.mcuId,
      internet: log.internet,
      door: log.door,
      plugin: log.plugin,
      tempValue: log.tempValue,
      realValue: log.realValue,
      date: log.date,
      time: log.time,
      isAlert: log.isAlert,
      message: log.message,
      probe: log.probe
    });
    const tags = { sn: message.mcuId, probe: message.probe, hospital: log.device.hospital, ward: log.device.ward };
    if (message.isAlert) {
      const fields = { message: message.message };
      await this.influxdb.writeData('templog-alert', fields, tags);
      this.socket.emit('send_message', {
        device: log.device.name,
        message: log.message,
        hospital: log.device.hospital,
        wardName: log.device.ward,
        time: log.createdAt.toString()
      });
      if (log.device.hospital === 'HID-DEVELOPMENT') {
        await this.firebase.pushNotification('admin', log.device.name, message.message);
      } else {
        await this.firebase.pushNotification('admin', log.device.name, log.message);
        await this.firebase.pushNotification('service', log.device.name, log.message);
        await this.firebase.pushNotification(log.device.ward, log.device.name, log.message);
        await this.firebase.pushNotification(log.device.hospital, log.device.name, log.message);
      }
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