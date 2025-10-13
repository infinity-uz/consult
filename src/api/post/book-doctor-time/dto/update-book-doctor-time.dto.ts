import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookDoctorTimeDto } from './create-book-doctor-time.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDoctorTimeDto extends PartialType(CreateBookDoctorTimeDto) {

    @ApiProperty({
        example: true,
        description: 'bu vaht avtivmi yoqmi shuni korsatib beradi (default true)',
        required: false,
    })
    isActive?: boolean 

    @ApiPropertyOptional({
        example: [1, 2],
        description: "Yangilash kerak bo'lsa doktor ID lar ro'yxati",
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ each: true })
    doctorId?: number[];
}
