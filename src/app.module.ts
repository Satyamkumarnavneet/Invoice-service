import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';
import { TasksModule } from './tasks/tasks.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { AppController } from './app.controller';  
import { AppService } from './app.service';        

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'), 
    InvoiceModule,
    TasksModule,
    RabbitMQModule,
  ],
  controllers: [AppController], 
  providers: [AppService],      
})
export class AppModule {}
