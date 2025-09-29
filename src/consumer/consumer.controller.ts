import { Controller } from '@nestjs/common';
import { EventPattern, Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { CreateTemplogDto } from '../dto/insert.dto';
import { JsonLogger } from '../logger';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}
  private readonly logger = JsonLogger.create('ConsumerController');

  @EventPattern('templog')
  async backup(@Payload() data: CreateTemplogDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    try {
      await this.consumerService.createTemplog(data);
      channel.ack(message);
    } catch (error) {
      this.logger.logError(
        'Failed to process templog message',
        error as Error,
        'ConsumerController.backup',
        { mcuId: data.mcuId, data }
      );
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
      this.logger.logError(
        'Failed to update hospital',
        error as Error,
        'ConsumerController.updateHospital',
        { hospitalData: data }
      );
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
      this.logger.logError(
        'Failed to update ward',
        error as Error,
        'ConsumerController.updateWard',
        { wardData: data }
      );
      channel.nack(message, false, false);
    }
  }
}