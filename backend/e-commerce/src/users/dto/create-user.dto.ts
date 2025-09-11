/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/users/dto/create-user.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressType } from 'src/common/enums/address-type.enum';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  line1: string; // corrected to match entity

  @IsOptional()
  @IsString()
  line2?: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsEnum(AddressType)
  type: AddressType;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses: AddressDto[];
}
