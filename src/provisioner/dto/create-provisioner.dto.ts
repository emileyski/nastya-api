import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateProvisionerDto {
  @ApiProperty({
    description: 'Имя поставщика',
    type: String,
    maxLength: 50,
    example: 'Иван Group',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Адрес поставщика',
    type: String,
    maxLength: 50,
    example: 'г. Киев, ул. Степана Бандэры, д. 1',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Телефон поставщика',
    type: String,
    maxLength: 50,
    example: '+380501234567',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\+380)[0-9]{9}$/)
  phoneNumber: string;

  @ApiProperty({
    description: 'Email поставщика',
    type: String,
    maxLength: 50,
    example: 'provisioner@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
  email: string;

  @ApiProperty({
    description: 'Сайт поставщика',
    type: String,
    maxLength: 255,
    example: 'https://provisioner.com',
  })
  @IsOptional()
  @IsString()
  site?: string;
}
