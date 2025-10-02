import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { CreateDoctorDto } from './create-doctor.dto';

export class SignInDoctorDto extends PickType(CreateDoctorDto, ['phoneNumber']) {
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
    description: 'Password for doctor',
    example: 'Admin123!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
