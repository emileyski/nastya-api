import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SupplySalesModule } from 'src/supply-sales/supply-sales.module';

@Module({
  imports: [SupplySalesModule, TypeOrmModule.forFeature([Sale])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
