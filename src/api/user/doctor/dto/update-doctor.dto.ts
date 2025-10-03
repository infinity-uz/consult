import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { RegisterDoctorDto } from './register-doctor.dto';

export class UpdateDoctorDto extends PartialType(RegisterDoctorDto) {
    @ApiPropertyOptional({
        type: 'boolean',
        description: 'Status of doctor',
        example: false,
      })
      @IsOptional()
      isActive?: boolean;
}
