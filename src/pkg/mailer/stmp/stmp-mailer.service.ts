import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { CONFIRM_REGISTRATION, MAIL_QUEUE } from './constants/mail.constants';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendConfirmationEmail(
    name: string,
    emailAddress: string,
    confirmUrl: string,
    code: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(CONFIRM_REGISTRATION, {
        name,
        emailAddress,
        confirmUrl,
        code,
      });
    } catch (error) {
      this.logger.error(
        `Error queueing registration email to user ${emailAddress}`,
      );

      throw error;
    }
  }
}
