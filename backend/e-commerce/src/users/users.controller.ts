/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.createUser(createUserDto);
      return user;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      console.error('Error creating user:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get user by email
   */
  @Get(':email')
  async getUser(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /**
   * Validate user password
   */
  @Post('validate')
  async validatePassword(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const isValid = await this.usersService.validatePassword(email, password);
    if (!isValid) {
      throw new NotFoundException('Invalid credentials');
    }
    return { success: true, message: 'Password is valid' };
  }

  /**
   * Update a user (by email)
   */
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserDto);
    return this.usersService['userRepo'].save(user); // or create a dedicated update method
  }

  /**
   * Delete a user (by email)
   */
  @Delete(':email')
  async deleteUser(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    await this.usersService['userRepo'].remove(user);
    return { success: true, message: `User ${email} deleted` };
  }
}
