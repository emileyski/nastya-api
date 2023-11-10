import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';

@ApiTags('supply')
@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.supplyService.create(createSupplyDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.supplyService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('in-stock')
  findAllInStock() {
    return this.supplyService.findAllInStock();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplyService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.supplyService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplyService.remove(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id/put-to-sale')
  putToSale(@Param('id') id: string) {
    return this.supplyService.putToSale(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id/remove-from-sale')
  removeFromSale(@Param('id') id: string) {
    return this.supplyService.removeFromSale(id);
  }
}
