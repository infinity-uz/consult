import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateSpecialityDto {
  @ApiProperty({
    type: 'string',
    description: 'Speciality name',
    example: 'Cardiology',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'boolean',
    description: 'Speciality is active or not',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: 'string',
    description: 'Description of speciality',
    example: 'Speciality related to heart diseases',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    required: false,
    example: '2025-10-01T12:00:00.000Z',
  })
  @IsOptional()
  timeDeleted: string | Date;
}
