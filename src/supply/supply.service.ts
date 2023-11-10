import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupplyService {
  constructor(
    @InjectRepository(Supply)
    private readonly supplyRepository: Repository<Supply>,
  ) {}

  create(createSupplyDto: CreateSupplyDto) {
    return this.supplyRepository.save({
      ...createSupplyDto,
      currentCount: createSupplyDto.count,
      provisioner: { id: createSupplyDto.provisionerId },
      product: { id: createSupplyDto.productId },
    });
  }

  //TODO: add pagination
  //TODO: add filters
  findAll() {
    return this.supplyRepository.find();
  }

  findOne(id: string) {
    return this.supplyRepository.findOne({ where: { id } });
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

  // async putToSale(id: string) {
  //   const supply = await this.supplyRepository.findOne({
  //     where: { id },
  //     relations: ['product', 'product.supplies'],
  //   });

  //   if (supply && supply.product) {
  //     const product = supply.product;
  //     console.log(product);
  //   } else {
  //     console.error(`Supply or product is undefined.`);
  //   }
  // }

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
