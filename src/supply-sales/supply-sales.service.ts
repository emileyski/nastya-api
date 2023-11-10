import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplySaleDto } from './dto/create-supply-sale.dto';
import { UpdateSupplySaleDto } from './dto/update-supply-sale.dto';
import { SupplySale } from './entities/supply-sale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplyService } from 'src/supply/supply.service';

@Injectable()
export class SupplySalesService {
  constructor(
    @InjectRepository(SupplySale)
    private readonly supplySaleRepository: Repository<SupplySale>,
    private readonly supplyService: SupplyService,
  ) {}

  async create(createSupplySaleDto: CreateSupplySaleDto) {
    const { count, productId } = createSupplySaleDto;
    const supply = await this.supplyService.findSuppliesByProductId(productId);

    if (!supply) {
      throw new NotFoundException('Supply not found');
    }

    if (supply.currentCount < count) {
      throw new NotFoundException('Not enough supplies');
    }

    const newSupplySale = this.supplySaleRepository.create({
      ...createSupplySaleDto,
      supply,
    });

    supply.currentCount -= count;
    await this.supplyService.save(supply);

    await this.supplySaleRepository.save(newSupplySale);

    return { ...newSupplySale, price: supply.price * count };
  }

  findAll() {
    return `This action returns all supplySales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supplySale`;
  }

  update(id: number, updateSupplySaleDto: UpdateSupplySaleDto) {
    return `This action updates a #${id} supplySale`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplySale`;
  }
}
