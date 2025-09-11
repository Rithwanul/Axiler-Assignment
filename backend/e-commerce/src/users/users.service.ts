/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Address } from '../addresses/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  /**
   * Create a new user with optional addresses
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { name, email, password, addresses } = createUserDto;

    // Check for existing user
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user entity
    const user = this.userRepo.create({
      name,
      email,
      password_hash: passwordHash,
      role: 'user',
    });

    // Attach addresses if provided
    if (addresses && addresses.length > 0) {
      user.addresses = addresses.map((addrDto) => {
        const address = new Address();
        address.line1 = addrDto.line1 ?? '';
        address.line2 = addrDto.line2 ?? '';
        address.city = addrDto.city ?? '';
        address.state = addrDto.state ?? '';
        address.country = addrDto.country ?? '';
        address.zip = addrDto.zip ?? '';
        address.type = addrDto.type;
        address.user = user; // set relation
        return address;
      });
    }

    // Save user (cascade inserts addresses)
    const savedUser = await this.userRepo.save(user);

    // Map to DTO to avoid circular references
    const response: UserResponseDto = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      addresses:
        savedUser.addresses?.map((addr) => ({
          line1: addr.line1,
          line2: addr.line2,
          city: addr.city,
          state: addr.state,
          country: addr.country,
          zip: addr.zip,
          type: addr.type,
        })) ?? [],
    };

    return response;
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['addresses'], // optional
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
