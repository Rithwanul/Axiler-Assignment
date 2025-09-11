// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from '../addresses/address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ default: 'user' })
  role: string;

  // List of addresses (can be multiple per user)
  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
