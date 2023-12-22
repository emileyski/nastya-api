import { Genders } from 'src/core/enums/gender.enum';
import { Roles } from 'src/core/enums/roles.enum';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_EMAIL', { unique: true })
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  birthDate: Date;

  @Column({ default: Roles.MANAGER })
  role: Roles;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  gender: Genders;

  @Index('IDX_TOKEN')
  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  picture?: string;
}
