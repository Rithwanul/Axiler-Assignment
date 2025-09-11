// src/addresses/address.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { AddressType } from '../common/enums/address-type.enum';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @Column()
  line1: string;

  @Column({ nullable: true })
  line2: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zip: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
