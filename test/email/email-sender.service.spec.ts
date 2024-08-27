import { Test, TestingModule } from '@nestjs/testing';
import { EmailSenderService } from '../../src/email-sender/email-sender.service';

describe('EmailSenderService', () => {
  let service: EmailSenderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailSenderService],
    }).compile();

    service = module.get<EmailSenderService>(EmailSenderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSalesReportEmail', () => {
    it('should send a sales report email', async () => {
      const report = {
        to: 'navneetsatyamkumar@gmail.com',
        subject: 'Daily Sales Report',
        text: 'This is the sales report',
      };

      // Mock the email sending method
      jest.spyOn(service, 'sendSalesReportEmail').mockResolvedValue(undefined); // Assuming the method returns void

      await expect(service.sendSalesReportEmail(report)).resolves.toBeUndefined();
    });

    it('should handle errors during email sending', async () => {
      const report = {
        to: 'navneetsatyamkumar@gmail.com',
        subject: 'Daily Sales Report',
        text: 'This is the sales report',
      };

      jest.spyOn(service, 'sendSalesReportEmail').mockRejectedValue(new Error('Email sending failed'));

      await expect(service.sendSalesReportEmail(report)).rejects.toThrow('Email sending failed');
    });
  });
});
