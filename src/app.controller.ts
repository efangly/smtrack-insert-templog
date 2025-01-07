import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateTemplogDto } from './dto/insert.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern() // Routing key
  async handleMessage(@Payload() message: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.appService.createTemplog(message as CreateTemplogDto);
      channel.ack(originalMsg);
    } catch (error) {
      console.error(error);
      channel.ack(originalMsg);
    }
  }
}
