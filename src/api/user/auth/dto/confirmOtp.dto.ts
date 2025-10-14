import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export enum OTPRoles {
  DOCTOR = 'doctor',
  PATEINTS = 'pateints',
}
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

  @ApiProperty({
    enum: OTPRoles,
    description: 'Roles of users',
    example: OTPRoles.DOCTOR,
  })
  @IsEnum(OTPRoles)
  @IsNotEmpty()
  model: OTPRoles;
}
