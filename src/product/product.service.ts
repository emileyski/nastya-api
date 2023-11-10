import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  //TODO: implement picture upload
  async create(createProductDto: CreateProductDto, picture?) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  //TODO: add pagination
  //TODO: add filters
  //TODO: implement the correct functionality for retrieving images
  findAll() {
    return this.productRepository.find();
  }

  //TODO: implement the correct functionality for retrieving images
  findOne(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto, picture?) {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    existingProduct.name = updateProductDto.name;
    existingProduct.description = updateProductDto.description;

    return this.productRepository.save(existingProduct);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
