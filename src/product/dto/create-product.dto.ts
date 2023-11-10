import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    type: String,
    default: 'Product name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    type: String,
    default: 'Product description',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
