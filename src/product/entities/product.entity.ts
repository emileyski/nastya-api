import { Supply } from 'src/supply/entities/supply.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  // @Column({ default: 0 })
  // currentCount: number;

  // @Column({ default: 0 })
  // currentPrice: number;

  // @Column({ default: false })
  // inSale: boolean;

  @OneToMany(() => Supply, (supply) => supply.product)
  supplies: Supply[];

  // @OneToOne(() => Supply, (supply) => supply.product, { nullable: true })
  // currentBatch?: Supply;

  @Column({ nullable: true })
  picture?: string;
}
