import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AccessTokenGuard } from 'src/core/guards/access-token.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils/file-upload.utils';
import { Public } from 'src/core/decorators/public.decorator';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //TODO: возможно изменить на вариант с ролями
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    example: 'Bearer access token',
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() picture) {
    return this.productService.create(createProductDto, picture);
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products',
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
    description: 'User name',
    required: false,
    example: 'John',
  })
  @Public()
  @Get()
  findAll(
    @Query('name') name = '',
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
  ) {
    return this.productService.findAll(
      parseInt(page.toString()),
      parseInt(perPage.toString()),
      name,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: imageFileFilter,
    }),
  )
  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() picture,
  ) {
    return this.productService.update(id, updateProductDto, picture);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
