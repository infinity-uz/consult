import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiPropertyOptional({
    type: 'boolean',
    description: 'Status of admin',
    example: false,
  })
  @IsOptional()
  isActive?: boolean;
}
