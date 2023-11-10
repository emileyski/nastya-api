import { Sale } from 'src/sales/entities/sale.entity';
import { Supply } from 'src/supply/entities/supply.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupplySale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @ManyToOne(() => Supply, (supply) => supply.sales, { onDelete: 'CASCADE' })
  supply: Supply;

  @ManyToOne(() => Sale, (sale) => sale.supplySales, { onDelete: 'CASCADE' })
  sale: Supply;
}
