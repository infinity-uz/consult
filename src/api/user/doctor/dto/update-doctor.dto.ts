import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsOptional } from 'class-validator';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
    @ApiPropertyOptional({
        type: 'boolean',
        description: 'Status of doctor',
        example: false,
      })
      @IsOptional()
      isActive?: boolean;
}
