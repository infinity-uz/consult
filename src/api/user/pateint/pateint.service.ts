import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePateintDto } from './dto/update-pateint.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { RegisterPateintDto } from './dto/register-pateint.dto';
import { Pateints } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';
import { successRes } from 'src/infrastructure/response/success';
import { Roles } from 'src/common/enum/Roles.enum';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { ISuccess } from 'src/infrastructure/response/success.interface';

@Injectable()
export class PateintService extends BaseService<
  RegisterPateintDto,
  UpdatePateintDto,
  Pateints
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.pateints);
  }
  async registerPAteint(dto: RegisterPateintDto) {
    const exists = await this.prisma.pateints.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (exists) throw new ConflictException('phone Number already exists');

    const newPatient = await this.prisma.pateints.create({ data: dto });
    return successRes({ newPatient }, 201);
  }

  async updatePatient(id: number, dto: UpdatePateintDto) {
    const patient = await this.prisma.pateints.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (dto.phoneNumber) {
      const existsUsername = await this.prisma.pateints.findUnique({
        where: { phoneNumber: dto.phoneNumber },
      });
      if (existsUsername && existsUsername.id !== id) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const updatingPatient = await this.prisma.pateints.update({
      where: { id },
      data: dto,
    });

    return successRes({ updatingPatient });
  }

    async softDelete(id: number, dto: softDeleteDto): Promise<ISuccess> {
      const pateints = await this.prisma.pateints.findUnique({ where: { id } });
  
      if (!pateints) throw new NotFoundException('Patient not found');
  
      let timeDeleted = pateints.timeDeleted;
      if (dto.isDeleted === true) {
        timeDeleted = new Date();
      } else if (dto.isDeleted === false) {
        timeDeleted = null; 
      }
  
      const deleteData = await this.prisma.pateints.update({
        where: { id },
        data: { ...dto, timeDeleted },
      });
  
      return successRes(deleteData, 200);
    }
}
