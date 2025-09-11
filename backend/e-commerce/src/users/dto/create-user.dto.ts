/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressType } from 'src/common/enums/address-type.enum';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;

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

  @ValidateNested({ each: true }) // ensures nested validation
  @Type(() => AddressDto) // ensures transform into class instance
  addresses: AddressDto[];
}
