import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Supply } from 'src/supply/entities/supply.entity';
import { SupplySalesService } from 'src/supply-sales/supply-sales.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Between, Repository } from 'typeorm';
import { SupplySale } from 'src/supply-sales/entities/supply-sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly supplySalesService: SupplySalesService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const supplieSales: SupplySale[] = [];

    let total = 0;

    for (const supplySaleDto of createSaleDto.supplySales) {
      const supplySale = await this.supplySalesService.create(supplySaleDto);
      total += supplySale.price;
      supplieSales.push({ ...supplySale });
    }

    const sale = this.saleRepository.create({
      totalPrice: total,
      supplySales: supplieSales, // Используем правильное имя свойства, supplySales вместо supplieSales
    });

    await this.saleRepository.save(sale);

    return sale;
  }

  async findAll(
    page: number,
    perPage: number,
    minTotalPrice: number,
    maxTotalPrice: number,
  ): Promise<{
    data: any[];
    page: number;
    perPage: number;
    totalPages: number;
    count: number;
  }> {
    const [sales, count] = await this.saleRepository.findAndCount({
      where: {
        totalPrice: Between(minTotalPrice, maxTotalPrice),
      },
      relations: ['supplySales.supply.product'],
      take: perPage,
      skip: perPage * (page - 1),
    });

    const totalPages = Math.ceil(count / perPage);

    const data = sales.map((sale) => this.getReturnableSales(sale));

    return { data, page, perPage, totalPages, count };
  }

  async findOne(id: string) {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['supplySales.supply.product'],
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return this.getReturnableSales(sale);
  }

  getReturnableSales(sale: Sale) {
    const productsSales = sale.supplySales.map((supplySale) => {
      return {
        product: supplySale.supply.product,
        count: supplySale.count,
        price: supplySale.count * supplySale.supply.price,
      };
    });

    const { supplySales, ...rest } = sale;

    return { sale: rest, productsSales };
  }

  async remove(id: string) {
    const removeResult = await this.saleRepository.delete(id);

    if (removeResult.affected === 0) {
      throw new NotFoundException(`Sale with id ${id} not found`);
    }

    return { message: `Sale with id ${id} was deleted` };
  }
}
