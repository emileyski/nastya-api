import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSupplyDto {
  @ApiProperty({
    description: 'Count of product',
    type: Number,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'Price of product',
    type: Number,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Expiration date of product',
    type: Date,
    example: '2021-01-01',
  })
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty({
    description: 'Id of provisioner',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  provisionerId: string;

  @ApiProperty({
    description: 'Id of product',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  productId: string;
}
