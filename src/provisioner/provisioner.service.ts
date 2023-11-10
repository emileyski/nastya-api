import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProvisionerDto } from './dto/create-provisioner.dto';
import { UpdateProvisionerDto } from './dto/update-provisioner.dto';
import { Provisioner } from './entities/provisioner.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProvisionerService {
  constructor(
    @InjectRepository(Provisioner)
    private readonly provisionerRepository: Repository<Provisioner>,
  ) {}

  create(createProvisionerDto: CreateProvisionerDto) {
    return this.provisionerRepository.save(createProvisionerDto);
  }

  //TODO: add pagination
  //TODO: add filters
  findAll() {
    return this.provisionerRepository.find();
  }

  findOne(id: string) {
    return this.provisionerRepository.findOne({ where: { id } });
  }

  async update(id: string, updateProvisionerDto: UpdateProvisionerDto) {
    const provisioner = await this.provisionerRepository.findOne({
      where: { id },
    });

    if (!provisioner) {
      throw new NotFoundException('Provisioner not found');
    }

    return this.provisionerRepository.save({
      ...provisioner,
      ...updateProvisionerDto,
    });
  }

  //TODO: refactor this
  async remove(id: string) {
    const removeResult = await this.provisionerRepository.delete(id);

    if (removeResult.affected === 0) {
      throw new NotFoundException('Provisioner not found');
    }

    return { message: `Provisioner with id ${id} was deleted` };
  }
}
