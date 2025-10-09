import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from 'src/common/enum/gender.enum';

export class RegisterDoctorDto {
  @ApiProperty({
    type: 'string',
    description: 'First name for doctor',
    example: 'Eshmat',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    type: 'string',
    description: 'Last name for doctor',
    example: 'Eshmatov',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number for doctor',
    example: '+998909876543',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phoneNumber: string;

  @ApiProperty({ type: 'number', description: 'Age of doctor', example: 30 })
  @Type(() => Number)
  @IsNumber()
  @Min(22)
  @Max(77)
  age: number;

  @ApiProperty({
    enum: Gender,
    description: 'Gender of doctor',
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    type: 'string',
    description: 'Location of doctor',
    example: 'Tashkent',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  location: string;

  @ApiProperty({ type: 'number', description: 'ID of service', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  servicesId: number;
}
