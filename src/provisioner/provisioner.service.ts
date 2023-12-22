import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProvisionerDto } from './dto/create-provisioner.dto';
import { UpdateProvisionerDto } from './dto/update-provisioner.dto';
import { Provisioner } from './entities/provisioner.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { MailToProvisionerDto } from './dto/mail-to-provisioner.dto';

@Injectable()
export class ProvisionerService {
  constructor(
    @InjectRepository(Provisioner)
    private readonly provisionerRepository: Repository<Provisioner>,
    private readonly mailService: MailService,
  ) {}

  create(createProvisionerDto: CreateProvisionerDto) {
    return this.provisionerRepository.save(createProvisionerDto);
  }

  async findAll(
    page: number,
    perPage: number,
    name: string,
  ): Promise<{
    data: Provisioner[];
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const [data, total] = await this.provisionerRepository.findAndCount({
      where: {
        name: name ? Like(`%${name}%`) : Like('%%'),
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return {
      data,
      page: +page,
      perPage: +perPage,
      totalPages: Math.ceil(total / perPage),
    };
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

  async sendEmailToProvisioner(
    email: string,
    subject: string,
    products: MailToProvisionerDto,
  ) {
    return this.mailService.sendEmailToProvisioner(email, subject, products);
  }
}
