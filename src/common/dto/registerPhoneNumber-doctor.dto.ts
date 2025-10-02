import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class ConfirmPhoneNumberDto {
  @ApiProperty({
    type: 'string',
    description: 'Phone number for doctor',
    example: '+998909876543',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phoneNumber: string;
}
