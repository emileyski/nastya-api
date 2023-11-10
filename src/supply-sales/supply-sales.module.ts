import { Module } from '@nestjs/common';
import { SupplySalesService } from './supply-sales.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplySale } from './entities/supply-sale.entity';
import { SupplyModule } from 'src/supply/supply.module';

@Module({
  imports: [SupplyModule, TypeOrmModule.forFeature([SupplySale])],
  providers: [SupplySalesService],
  exports: [SupplySalesService],
})
export class SupplySalesModule {}
