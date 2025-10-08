import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma.service';
import { Service as ServiceModel } from 'generated/prisma';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class ServiceService extends BaseService<
  CreateServiceDto,
  UpdateServiceDto,
  ServiceModel
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.service);
  }

  async create(dto: CreateServiceDto): Promise<ISuccess> {
    const existsName = await this.prisma.service.findFirst({
      where: { name: dto.name },
    });
    if (existsName) throw new ConflictException('Service already exists');

    const data: any = {
      ...dto,
    };

    

    const service = await this.prisma.service.create({ data });

    return successRes(service, 201);
  }

  async update(id: number, dto: UpdateServiceDto): Promise<ISuccess> {
    const exists = await this.prisma.service.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Service with Id ${id} not found`);
    }

    const service = await this.prisma.service.update({
      where: { id },
      data: dto,
    });
    return successRes(service);
  }

  async delete(id: number): Promise<ISuccess> {
    const exists = await this.prisma.service.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }

    const deletedService = await this.prisma.service.update({
      where: { id },
      data: { timeDeleted: new Date() },
    });

    return successRes(deletedService, 200);
  }
}
