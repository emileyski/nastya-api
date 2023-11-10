import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Supply } from 'src/supply/entities/supply.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  soldAt: Date;

  @Column()
  count: number;

  @ManyToOne(() => Supply, (supply) => supply.sales)
  supply: Supply;
}
