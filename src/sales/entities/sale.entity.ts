import { SupplySale } from 'src/supply-sales/entities/supply-sale.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: new Date() })
  soldAt: Date;

  @Column()
  totalPrice: number;

  @OneToMany(() => SupplySale, (supplySale) => supplySale.sale, {
    onDelete: 'CASCADE',
  })
  supplySales: SupplySale[];
}
