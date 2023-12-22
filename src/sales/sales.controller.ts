import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiOperation({
    summary: 'Create a sale',
    description: 'Create a sale',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @ApiOperation({
    summary: 'Get all sales',
    description: 'Get all sales',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    description: 'Sales per page',
    required: false,
    example: 10,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('minTotalPrice') minTotalPrice = 0,
    @Query('maxTotalPrice') maxTotalPrice = 100000000,
  ) {
    return this.salesService.findAll(
      page,
      perPage,
      minTotalPrice,
      maxTotalPrice,
    );
  }

  @ApiOperation({
    summary: 'Get a sale by id',
    description: 'Get a sale by id',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete a sale by id',
    description: 'Delete a sale by id',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
