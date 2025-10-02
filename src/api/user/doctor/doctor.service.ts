import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Doctor } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { AuthService } from '../auth/auth.service';

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
}
