import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    type: 'string',
    description: 'Service name',
    example: 'Blood Test',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'number',
    description: 'Price of service',
    example: 150000,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: 'string',
    description: 'Service description',
    example: 'A medical blood test',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'Deleted time',
    example: '2025-10-01T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  timeDeleted?: string | Date;
}
