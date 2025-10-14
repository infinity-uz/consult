import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateDoctorDocumentDto {
    @ApiProperty({
        description: 'Shifokorning pasport fayli',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    passport: Express.Multer.File;

    @ApiProperty({
        description: 'Shifokorning diplom fayli',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    diplom: Express.Multer.File;

    @ApiProperty({
        description: 'Shifokorning sertifikat fayli',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    certificate: Express.Multer.File;

    @ApiProperty({
        description: 'Self-employment (yakka tartibdagi faoliyat) hujjat fayli',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    selfEmployment: Express.Multer.File;

    @ApiProperty({
        description: 'Shifokorning asosiy rasm fayli',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty()
    image: Express.Multer.File;

    @ApiProperty({
        description: 'Doctor ID (foreign key)',
        example: 3,
    })
    @IsNotEmpty()
    @IsInt()
    doctorId: number;
}
