import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma.service';
import { Speciality } from 'generated/prisma';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class SpecialityService extends BaseService<
  CreateSpecialityDto,
  UpdateSpecialityDto,
  Speciality
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.speciality);
  }

  async create(dto: CreateSpecialityDto): Promise<ISuccess> {
    const existsName = await this.prisma.speciality.findFirst({
      where: { name: dto.name },
    });
    if (existsName) throw new ConflictException('Service already exists');

    const data: any = {
      ...dto,
    };


    const speciality = await this.prisma.speciality.create({ data });

    return successRes(speciality, 201);
  }

  async update(id: number, dto: UpdateSpecialityDto): Promise<ISuccess> {
    const exists = await this.prisma.speciality.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Speciality with Id ${id} not found`);
    }

    const speciality = await this.prisma.speciality.update({
      where: { id },
      data: dto,
    });
    return successRes(speciality);
  }

  async delete(id: number): Promise<ISuccess> {
    const exists = await this.prisma.speciality.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Speciality with id ${id} not found`);
    }

    const deletedSpeciality = await this.prisma.speciality.update({
      where: { id },
      data: { timeDeleted: new Date() },
    });

    return successRes(deletedSpeciality, 200);
  }
}
