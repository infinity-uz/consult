import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ConfirmOtpDto {
  @ApiProperty({
    type: 'string',
    description: 'Phone number for doctor',
    example: '+998909876543',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
    description: 'Otp of doctor',
    example: 123456,
  })
  @IsString()
  @Length(6)
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  @IsNotEmpty()
  otp: string;
}
