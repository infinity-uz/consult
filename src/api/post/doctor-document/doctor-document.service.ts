import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDocumentDto } from './dto/create-doctor-document.dto';
import { UpdateDoctorDocumentDto } from './dto/update-doctor-document.dto';
import { ImageService } from '../image/image.service';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class DoctorDocumentService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly imageService: ImageService,
    ) { }

    private async saveFile(file: Express.Multer.File): Promise<string> {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, `${Date.now()}-${file.originalname}`);
        fs.writeFileSync(filePath, file.buffer);

        // URL shaklida qaytaramiz (frontend yoki Swagger uchun)
        return `/uploads/${path.basename(filePath)}`;
    }

    async create(
        dto: CreateDoctorDocumentDto,
        files: Record<string, Express.Multer.File[]>,
    ) {
        const document = await this.prisma.doctorDocument.create({
            data: {
                doctorId: dto.doctorId,
                passportUrl: '',
                diplomUrl: '',
                certificateUrl: '',
                selfEmploymentUrl: '',
                imageUrl: '',
            },
        });

        // Fayllarni saqlash
        for (const key of Object.keys(files)) {
            const file = files[key]?.[0];
            if (file) {
                const url = await this.saveFile(file);
                await this.prisma.doctorDocument.update({
                    where: { id: document.id },
                    data: { [`${key}Url`]: url },
                });

                // ImageService orqali ham saqlaymiz
                await this.imageService.create({
                    imageUrl: url,
                    name: key,
                    doctorDocumentId: document.id,
                });
            }
        }

        return this.prisma.doctorDocument.findUnique({
            where: { id: document.id },
            include: { image: true },
        });
    }

    async update(
        id: number,
        dto: UpdateDoctorDocumentDto,
        files: Record<string, Express.Multer.File[]>,
    ) {
        const existing = await this.prisma.doctorDocument.findUnique({
            where: { id },
        });
        if (!existing) throw new NotFoundException('DoctorDocument topilmadi');

        const updateData: any = { ...dto };

        for (const key of Object.keys(files)) {
            const file = files[key]?.[0];
            if (file) {
                const url = await this.saveFile(file);
                updateData[`${key}Url`] = url;

                // ImageService orqali yangisini qo‘shamiz
                await this.imageService.create({
                    imageUrl: url,
                    name: key,
                    doctorDocumentId: id,
                });
            }
        }

        return this.prisma.doctorDocument.update({
            where: { id },
            data: updateData,
            include: { image: true },
        });
    }
}
