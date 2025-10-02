import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: 'string',
    description: 'Username for admin',
    example: 'Admin1',
  })
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    description: 'Password for admin',
    example: 'Admin123!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number for admin',
    example: '+998901234567',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ') // 'UZ' kodi bilan Uzbekistan telefon raqamlarini tekshiradi berilmasa barcha mamlaketlarni oladi)
  phoneNumber: string;
}
