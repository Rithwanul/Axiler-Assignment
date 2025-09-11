// src/users/dto/user-response.dto.ts

import { AddressDto } from 'src/addresses/dto/address.dto';

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  addresses: AddressDto[];
}
