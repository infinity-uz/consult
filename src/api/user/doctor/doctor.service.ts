import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Doctor } from 'generated/prisma';

import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { PrismaService } from 'src/core/prisma.service';
import { successRes } from 'src/infrastructure/response/success';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { Roles } from 'src/common/enum/Roles.enum';
import { RegisterDoctorDto } from './dto/register-doctor.dto';

@Injectable()
export class DoctorService extends BaseService<
  RegisterDoctorDto,
  UpdateDoctorDto,
  Doctor
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.doctor);
  }

  async registerDoctor(dto: RegisterDoctorDto) {
    const exists = await this.prisma.doctor.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (exists) {
      throw new ConflictException(
        'Doctor with this phone number already exists',
      );
    }
    
    const existsService = await this.prisma.service.findUnique({
      where: { id: dto.servicesId },
    });
    if (!existsService) {
      throw new NotFoundException('Service not found');
    }

    const newDoctor = await this.prisma.doctor.create({
      data: dto,
    });

    return successRes(
      {
        data: newDoctor,
      },
      201,
    );
  }

  async updateDoctor(
    id: number,
    dto: UpdateDoctorDto,
    user: IToken,
  ): Promise<ISuccess> {
    const { phoneNumber, isActive, servicesId } = dto;

    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (servicesId) {
      const existsService = await this.prisma.speciality.findUnique({
        where: { id: servicesId },
      });
      if (existsService) throw new NotFoundException('Services not found');
    }

    if (![Roles.SUPERADMIN, Roles.ADMIN].includes(user.role as Roles)) {
      delete dto.phoneNumber;
      delete dto.isActive;
    }

    if (phoneNumber) {
      const existsUsername = await this.prisma.doctor.findUnique({
        where: { phoneNumber },
      });
      if (existsUsername && existsUsername.id !== id) {
        throw new ConflictException('Phone number already exists');
      }
    }

    await this.prisma.doctor.update({
      where: { id },
      data: dto,
    });

    const updatingDoctor = await this.prisma.admin.findUnique({
      where: { id },
    });
    return successRes(updatingDoctor, 200);
  }

  async softDelete(id: number, dto: softDeleteDto): Promise<ISuccess> {
    await this.findOneById(id);

    await this.prisma.doctor.update({
      where: { id },
      data: { isDeleted: dto.isDeleted },
    });

    let timeDeleted: any = null;
    if (dto.isDeleted) {
      timeDeleted = new Date();
    }

    await this.prisma.admin.update({ where: { id }, data: { timeDeleted } });
    const deleteData = await this.prisma.admin.findUnique({ where: { id } });

    return successRes(deleteData, 200);
  }
}
