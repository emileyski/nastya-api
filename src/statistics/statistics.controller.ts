import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { StatisticsService } from './statistics.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Public()
  @Get('weekly-sales')
  getWeeklySales() {
    return this.statisticsService.getWeeklySales();
  }

  @Public()
  @Get('top-provisioners')
  getTopProvisioners() {
    return this.statisticsService.getTopProvisioners();
  }

  @Public()
  @Get('top-products')
  getTopProducts() {
    return this.statisticsService.getTopProducts();
  }
}
