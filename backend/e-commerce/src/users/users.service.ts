/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Address } from '../addresses/address.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, addresses } = createUserDto;

    // Hash password safely
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user entity
    const user = this.userRepo.create({
      name,
      email,
      password_hash: passwordHash,
    });

    // Create address entities and assign user relation
    const addressEntities = addresses.map((addr) =>
      this.addressRepo.create({ ...addr, user }),
    );

    user.addresses = addressEntities;

    // Save user and addresses together
    return this.userRepo.save(user);
  }

  /**
   * Find a user by email.
   * Throws NotFoundException if not found.
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['addresses'], // include addresses
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Validate user password
   */
  async validatePassword(
    email: string,
    plainPassword: string,
  ): Promise<boolean> {
    const user = await this.findByEmail(email);
    return bcrypt.compare(plainPassword, user.password_hash);
  }
}
