import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { CreateTemplogDto } from '../dto/insert.dto';
;

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}
  private readonly logger = new Logger(ConsumerService.name);

  @EventPattern('templog')
  async backup(@Payload() data: CreateTemplogDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.consumerService.createTemplog(data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error, data.mcuId);
      channel.nack(message, false, false);
    }
  }

  @EventPattern('update-hospital')
  async updateHospital(@Payload() data: { id: string, name: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.consumerService.updateHospital(data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      channel.nack(message, false, false);
    }
  }
  @EventPattern('update-ward')
  async updateWard(@Payload() data: { id: string, name: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.consumerService.updateWard(data);
      channel.ack(message);
    } catch (error) {
      this.logger.error(error);
      channel.nack(message, false, false);
    }
  }
}