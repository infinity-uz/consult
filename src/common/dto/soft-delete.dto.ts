import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class softDeleteDto {
  @ApiProperty({
    type: 'boolean',
    description: 'soft delete for admin',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isDeleted: boolean;
}
