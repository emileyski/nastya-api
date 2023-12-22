import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { Between, LessThan, Like, MoreThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createSupplyDto: CreateSupplyDto) {
    const product = await this.productRepository.findOne({
      where: { id: createSupplyDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with id ${createSupplyDto.productId} not found`,
      );
    }

    const supply = this.supplyRepository.create({
      ...createSupplyDto,
      product,
      currentCount: createSupplyDto.count,
      provisioner: { id: createSupplyDto.provisionerId },
    });

    await this.supplyRepository.save(supply);

    return supply;
  }

  save(supply: Supply) {
    return this.supplyRepository.save(supply);
  }

  async findAll(
    page: number,
    perPage: number,
    name: string,
    minPrice: number,
    maxPrice: number,
    mustBeInSale: boolean,
  ): Promise<{
    data: Supply[];
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const whereConditions: any = {
      product: {
        name: name ? Like(`%${name}%`) : Like('%%'),
      },
      price: minPrice
        ? MoreThan(minPrice)
        : maxPrice
        ? LessThan(maxPrice)
        : Between(0, 1000000),
    };

    if (mustBeInSale) {
      // Add additional conditions for supplies that must be in sale
      whereConditions.inSale = true;
    }

    const [data, total] = await this.supplyRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * perPage,
      take: perPage,
      relations: ['product', 'provisioner'],
    });

    return {
      data,
      page: +page,
      perPage: +perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  // findAllInStock() {
  //   return this.supplyRepository.find({
  //     where: {
  //       inSale: true,
  //       currentCount: MoreThan(0),
  //       expirationDate: MoreThan(new Date()),
  //     },
  //     relations: ['product', 'provisioner'],
  //   });
  // }

  findOne(id: string, options?: { relations?: string[] }) {
    return this.supplyRepository.findOne({ where: { id }, ...options });
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.supplyRepository.findOne({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    return this.supplyRepository.save({
      ...supply,
      ...updateSupplyDto,
      currentCount: updateSupplyDto.count,
    });
  }

  async remove(id: string) {
    const removeResult = await this.supplyRepository.delete(id);

    if (removeResult.affected === 0) {
      throw new NotFoundException('Supply not found');
    }

    return { message: `Supply with id ${id} was deleted` };
  }

  findSuppliesByProductId(productId: string) {
    return this.supplyRepository.findOne({
      where: { product: { id: productId }, inSale: true },
      relations: ['product', 'provisioner'],
    });
  }

  async removeFromSale(id: string) {
    const supply = await this.supplyRepository.findOne({
      where: { id, inSale: true },
    });

    if (!supply) {
      throw new NotFoundException(
        'Supply not found or this supply not in sale',
      );
    }

    supply.inSale = false;
    await this.supplyRepository.save(supply);
    return { message: `Supply with id ${id} was removed from sale` };
  }

  async putToSale(id: string) {
    const supply = await this.supplyRepository.findOne({
      where: { id },
      relations: ['product', 'product.supplies'],
    });

    if (supply && supply.product) {
      const product = supply.product;

      // Проверяем, есть ли другие поставки этого продукта в продаже
      const otherSuppliesInSale = product.supplies.some(
        (s) => s.inSale && s.id !== supply.id,
      );

      if (otherSuppliesInSale) {
        // Есть другие поставки этого продукта в продаже, выбрасываем ошибку 400
        throw new BadRequestException(
          `Другие поставки продукта "${product.name}" уже в продаже.`,
        );
      } else {
        // Нет других поставок этого продукта в продаже, устанавливаем inSale в true
        supply.inSale = true;
        await this.supplyRepository.save(supply);

        const { product: newProduct, ...supplyWithoutProduct } = supply;
        return supplyWithoutProduct;
      }
    } else {
      // supply или product не определены, выбрасываем ошибку 400
      throw new NotFoundException(`Поставка или продукт не найдены.`);
    }
  }
}
