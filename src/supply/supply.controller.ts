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
  Query,
} from '@nestjs/common';
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { Role } from 'src/core/decorators/role.decorator';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Roles } from 'src/core/enums/roles.enum';

@ApiTags('supply')
@Controller('supply')
export class SupplyController {
  constructor(private readonly supplyService: SupplyService) {}

  @ApiOperation({
    summary: 'Create a supply',
    description: 'Create a supply (this method is only for admins)',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.supplyService.create(createSupplyDto);
  }

  @ApiOperation({
    summary: 'Get all supplies',
    description:
      'Get all supplies (this method is only for admins), you can filter by name, add pagination (page, perPage)',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    description: 'Users per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    description: 'Product name',
    required: false,
    example: 'Banana',
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Minimum price',
    required: false,
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Maximum price',
    required: false,
    example: 1000,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(
    @Query('name') name = '',
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('minPrice') minPrice = 0,
    @Query('maxPrice') maxPrice = 0,
  ) {
    return this.supplyService.findAll(
      page,
      perPage,
      name,
      minPrice,
      maxPrice,
      false,
    );
  }

  @ApiOperation({
    summary: 'Get supplies in stock',
    description:
      'Get supplies in stock (this method is only for admins), you can filter by name, add pagination (page, perPage)',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    description: 'Products per page',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    description: 'Product name',
    required: false,
    example: 'Banana',
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Minimum price',
    required: false,
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Maximum price',
    required: false,
    example: 1000,
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UseGuards(AccessTokenGuard)
  @Get('in-stock')
  findAllInStock(
    @Query('name') name = '',
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('minPrice') minPrice = 0,
    @Query('maxPrice') maxPrice = 0,
  ) {
    return this.supplyService.findAll(
      page,
      perPage,
      name,
      minPrice,
      maxPrice,
      true,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplyService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplyDto: UpdateSupplyDto) {
    return this.supplyService.update(id, updateSupplyDto);
  }

  @ApiOperation({
    summary: 'Delete a supply',
    description: 'Delete a supply (this method is only for admins)',
  })
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplyService.remove(id);
  }

  @ApiOperation({
    summary: 'Put a supply to sale',
    description: 'Put a supply to sale (this method is only for admins)',
  })
  @UseGuards(AccessTokenGuard, RoleGuard)
  @Role(Roles.ADMIN)
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
