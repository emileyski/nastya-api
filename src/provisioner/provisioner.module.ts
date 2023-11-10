import { Module } from '@nestjs/common';
import { ProvisionerService } from './provisioner.service';
import { ProvisionerController } from './provisioner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provisioner } from './entities/provisioner.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Provisioner]), MailModule],
  controllers: [ProvisionerController],
  providers: [ProvisionerService],
})
export class ProvisionerModule {}
