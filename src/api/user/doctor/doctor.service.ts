import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Doctor } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { AuthService } from '../auth/auth.service';
import { successRes } from 'src/infrastructure/response/success';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { SignInDoctorDto } from './dto/signIn-doctor.dto';
import { IToken } from 'src/infrastructure/token/interface';
import { Response } from 'express';
import { Roles } from 'src/common/enum/Roles.enum';

@Injectable()
export class DoctorService extends BaseService<
  CreateDoctorDto,
  UpdateDoctorDto,
  Doctor
> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly jwt: TokenService,
    private readonly authService: AuthService,
  ) {
    super(prisma, prisma.doctor);
  }

  async signIn(dto: SignInDoctorDto, res: Response): Promise<ISuccess> {
    const { phoneNumber, password } = dto;
    const doctor = await this.prisma.doctor.findUnique({
      where: { phoneNumber },
    });

    if (!doctor) {
      throw new NotFoundException('No doctor found for this number');
    }

    if (doctor.isActive === true || doctor.isDeleted === true) {
      throw new ForbiddenException('This user is not active');
    }
    const payload: IToken = {
      id: doctor.id,
      isActive: true,
      role: doctor.role,
    };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);
    await this.jwt.writeCookie(res, 'doctorToken', refreshToken, 15);

    return successRes({ token: accessToken });
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

    if (user.role !== Roles.SUPERADMIN) {
      if (phoneNumber) {
        delete dto.phoneNumber;
      }
      if (typeof isActive === 'boolean') {
        delete dto.isActive;
      }
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

    const updatingDoctor = await this.prisma.admin.findUnique({ where: { id } });
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
