import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/common/enum/gender.enum';

export class RegisterPateintDto {
  @ApiProperty({
    type: 'string',
    description: 'First name for patient',
    example: 'Eshmat',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    type: 'string',
    description: 'Last name for patient',
    example: 'Eshmatov',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    type: 'string',
    description: 'Phone number for patient',
    example: '+998909876543',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  phoneNumber: string;

  @ApiProperty({
    enum: Gender,
    description: 'Gender of patient',
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ type: 'number', description: 'Age of patient', example: 30 })
  @Type(() => Number)
  @IsNumber()
  @Min(22)
  @Max(77)
  age: number;

  @ApiProperty({
    type: 'string',
    description: 'Location of patient',
    example: 'Tashkent',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  location: string;
}
