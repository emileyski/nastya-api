import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSupplySaleDto {
  @ApiProperty({
    description: 'The count of the sale',
    type: Number,
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    description: 'The id of the product',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
}
