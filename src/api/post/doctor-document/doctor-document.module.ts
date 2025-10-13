import { Module } from '@nestjs/common';
import { DoctorDocumentService } from './doctor-document.service';
import { ImageService } from '../image/image.service';
import { DoctorDocumentController } from './doctor-docment.controller';

@Module({
    controllers: [DoctorDocumentController],
    providers: [DoctorDocumentService, ImageService],
})
export class DoctorDocumentModule { }
