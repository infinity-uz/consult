import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDoctorDocumentDto } from './create-doctor-document.dto';

export class UpdateDoctorDocumentDto extends PartialType(CreateDoctorDocumentDto) {
    @ApiPropertyOptional({
        description: 'Agar kerak bo\'lsa, yangi pasport fayli',
        type: 'string',
        format: 'binary',
    })
    passport?: Express.Multer.File;

    @ApiPropertyOptional({
        description: 'Agar kerak bo\'lsa, yangi diplom fayli',
        type: 'string',
        format: 'binary',
    })
    diplom?: Express.Multer.File;

    @ApiPropertyOptional({
        description: 'Agar kerak bo\'lsa, yangi sertifikat fayli',
        type: 'string',
        format: 'binary',
    })
    certificate?: Express.Multer.File;

    @ApiPropertyOptional({
        description: 'Agar kerak bo\'lsa, yangi self-employment fayli',
        type: 'string',
        format: 'binary',
    })
    selfEmployment?: Express.Multer.File;

    @ApiPropertyOptional({
        description: 'Agar kerak bo\'lsa, yangi shifokor rasmi',
        type: 'string',
        format: 'binary',
    })
    image?: Express.Multer.File;
}
