import { Supply } from 'src/supply/entities/supply.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provisioner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  address: string;

  @OneToMany(() => Supply, (supply) => supply.provisioner, {
    onDelete: 'CASCADE',
  })
  supplies: Supply[];

  @Column({ nullable: true })
  site?: string;
}
