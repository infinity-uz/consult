import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class softDeleteDto {
  @ApiProperty({
    type: 'boolean',
    description: 'soft delete',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;

  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Status',
    example: false,
  })
  @IsOptional()
  isActive?: boolean;
}
