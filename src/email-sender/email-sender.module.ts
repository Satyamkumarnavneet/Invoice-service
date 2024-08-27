import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { EmailSenderController } from './email-sender.controller';

@Module({
  providers: [EmailSenderService],
  controllers: [EmailSenderController],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
