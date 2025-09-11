/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
