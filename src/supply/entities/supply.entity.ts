import { Product } from 'src/product/entities/product.entity';
import { Provisioner } from 'src/provisioner/entities/provisioner.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Supply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @Column()
  currentCount: number;

  @Column({ default: false })
  inSale: boolean;

  @Column()
  price: number;

  @Column({ default: new Date() })
  supplyDate: Date;

  @Column()
  expirationDate: Date;

  @ManyToOne(() => Product, (product) => product.supplies)
  product: Product;

  @ManyToOne(() => Provisioner, (provisioner) => provisioner.supplies)
  provisioner: Provisioner;

  @OneToMany(() => Sale, (sale) => sale.supply)
  sales: Sale[];
}
