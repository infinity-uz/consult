import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateImageDto {
    @ApiProperty({
        description: 'Rasmning URL manzili',
        example: 'https://example.com/uploads/doctor1.png',
    })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({
        description: 'Rasmning nomi',
        example: 'Doctor diploma image',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Rasm tegishli bo\'lgan doctor_document_id (foreign key)',
        example: 12,
    })
    @IsNotEmpty()
    @IsInt()
    doctorDocumentId: number;
}
