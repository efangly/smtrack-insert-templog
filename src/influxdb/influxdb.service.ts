import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxdbService implements OnModuleInit {
  private readonly org = process.env.INFLUXDB_ORG;
  private readonly bucket = process.env.INFLUXDB_BUCKET || 'smtrack-templog';
  private writeApi: WriteApi;

  constructor(@Inject('INFLUXDB') private readonly influxDB: InfluxDB) {}

  async writeData(measurement: string, fields: Record<string, any>, tags: Record<string, string>) {
    const point = new Point(measurement);
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'number') {
        point.floatField(key, value);
      } else if (typeof value === 'boolean') {
        point.booleanField(key, value);
      } else {
        point.stringField(key, value);
      }
    });

    Object.entries(tags).forEach(([key, value]) => { point.tag(key, value) });
    
    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }

  onModuleInit() {
    this.writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
  }
}
