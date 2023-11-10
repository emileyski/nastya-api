import { ApiProperty } from '@nestjs/swagger';

export class MailToProvisionerDto {
  @ApiProperty({
    description: 'Продукты, которые нужно заказать',
    type: [Object],
    example: [
      {
        product: 'Молоко',
        quantity: 10,
      },
    ],
  })
  products: { product: string; quantity: number }[];
}
