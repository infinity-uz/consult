import {
    Controller,
    Post,
    Patch,
    Param,
    Body,
    UseInterceptors,
    UploadedFiles,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateDoctorDocumentDto } from './dto/create-doctor-document.dto';
import { UpdateDoctorDocumentDto } from './dto/update-doctor-document.dto';
import { DoctorDocumentService } from './doctor-document.service';

@ApiTags('DoctorDocument')
@Controller('doctor-document')
export class DoctorDocumentController {
    constructor(private readonly service: DoctorDocumentService) { }

    @Post()
    @ApiOperation({ summary: 'Yangi shifokor hujjatlarini yuklash' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'passport', maxCount: 1 },
            { name: 'diplom', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
            { name: 'selfEmployment', maxCount: 1 },
            { name: 'image', maxCount: 1 },
        ]),
    )
    async create(
        @UploadedFiles()
        files: {
            passport?: Express.Multer.File[];
            diplom?: Express.Multer.File[];
            certificate?: Express.Multer.File[];
            selfEmployment?: Express.Multer.File[];
            image?: Express.Multer.File[];
        },
        @Body() dto: CreateDoctorDocumentDto,
    ) {
        return this.service.create(dto, files);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Shifokor hujjatlarini yangilash' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'passport', maxCount: 1 },
            { name: 'diplom', maxCount: 1 },
            { name: 'certificate', maxCount: 1 },
            { name: 'selfEmployment', maxCount: 1 },
            { name: 'image', maxCount: 1 },
        ]),
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFiles()
        files: {
            passport?: Express.Multer.File[];
            diplom?: Express.Multer.File[];
            certificate?: Express.Multer.File[];
            selfEmployment?: Express.Multer.File[];
            image?: Express.Multer.File[];
        },
        @Body() dto: UpdateDoctorDocumentDto,
    ) {
        return this.service.update(id, dto, files);
    }
}
