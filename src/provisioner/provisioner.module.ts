import { Module } from '@nestjs/common';
import { ProvisionerService } from './provisioner.service';
import { ProvisionerController } from './provisioner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provisioner } from './entities/provisioner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provisioner])],
  controllers: [ProvisionerController],
  providers: [ProvisionerService],
})
export class ProvisionerModule {}
