import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookDoctorTimeDto } from './create-book-doctor-time.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDoctorTimeDto extends PartialType(CreateBookDoctorTimeDto) {

    @ApiProperty({
        example: true,
        description: 'aktivmi yoqmi shuni korsatib beradi (default true)',
        required: false,
    })
    isActive?: boolean 

    @ApiPropertyOptional({
        example: [1],
        description: "Yangilash kerak bolsa doktor ID lar royxati",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ each: true })
    doctorId?: number[];
}
