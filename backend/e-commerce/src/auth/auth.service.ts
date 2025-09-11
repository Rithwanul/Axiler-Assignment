/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return { message: 'User registered successfully', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.oldPassword, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    user.password_hash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService['userRepo'].save(user);

    return { message: 'Password reset successfully' };
  }
}
