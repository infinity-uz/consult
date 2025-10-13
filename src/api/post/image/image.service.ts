import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/core/prisma.service';

@Injectable()
export class ImageService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateImageDto) {
        return this.prisma.image.create({ data: dto });
    }

    async findAll() {
        return this.prisma.image.findMany();
    }

    async findOne(id: number) {
        const image = await this.prisma.image.findUnique({ where: { id } });
        if (!image) throw new NotFoundException('Rasm topilmadi');
        return image;
    }

    async update(id: number, dto: UpdateImageDto) {
        const exist = await this.prisma.image.findUnique({ where: { id } });
        if (!exist) throw new NotFoundException('Rasm topilmadi');

        return this.prisma.image.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: number) {
        const exist = await this.prisma.image.findUnique({ where: { id } });
        if (!exist) throw new NotFoundException('Rasm topilmadi');

        return this.prisma.image.delete({ where: { id } });
    }
}
