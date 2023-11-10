import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateSupplySaleDto } from 'src/supply-sales/dto/create-supply-sale.dto';

export class CreateSaleDto {
  @ApiProperty({
    description: 'The array of supply sales',
    type: [CreateSupplySaleDto],
    example: [
      {
        count: 10,
        productId: '550e8400-e29b-41d4-a716-446655440000',
      },
      {
        count: 20,
        productId: '550e8400-e29b-41d4-a716-446655440001',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  supplySales: CreateSupplySaleDto[];
}
