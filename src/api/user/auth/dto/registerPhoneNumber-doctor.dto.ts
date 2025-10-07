import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { OTPRoles } from './confirmOtp.dto';

export enum TypeRequest {
  REGISTR = 'REGISTR',
  SIGNIN = 'SIGNIN',
  UPDATEPHNUMBER = 'UPDATE',
}
export class ConfirmPhoneNumberDto {
  @ApiProperty({
    type: 'string',
    description: 'Phone number for users',
    example: '+998909876543',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phoneNumber: string;

  @ApiProperty({
    enum: OTPRoles,
    description: 'Type request',
    example: TypeRequest.REGISTR,
  })
  @IsEnum(TypeRequest)
  @IsNotEmpty()
  type: TypeRequest;

  @ApiProperty({
    enum: OTPRoles,
    description: 'Roles of users',
    example: OTPRoles.DOCTOR,
  })
  @IsEnum(OTPRoles)
  @IsNotEmpty()
  model: OTPRoles;
}
