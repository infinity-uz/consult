import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { Admin } from 'generated/prisma';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { successRes } from 'src/infrastructure/response/success';
import { PrismaService } from 'src/core/prisma.service';
import { SignInDto } from './dto/signIn.dto';
import { Response } from 'express';
import { TokenService } from 'src/infrastructure/token/Token';
import { IToken } from 'src/infrastructure/token/interface';
import { Roles } from 'src/common/enum/Roles.enum';
import { config } from 'src/config/envConfig';
import { AuthService } from '../auth/auth.service';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';

@Injectable()
export class AdminService
  extends BaseService<CreateAdminDto, UpdateAdminDto, Admin>
  implements OnModuleInit
{
  constructor(
    protected readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly jwt: TokenService,
    private readonly authService: AuthService,
  ) {
    super(prisma, prisma.admin);
  }

  async onModuleInit(): Promise<void> {
    try {
      const {
        SUPER_ADMIN_PASSWORD: password,
        SUPER_ADMIN_PHONE_NUMBER: phNumber,
        SUPER_ADMIN_USERNAME: username,
      } = config.SUPER_ADMIN;

      const existsSuperadmin = await this.prisma.admin.findFirst({
        where: { role: Roles.SUPERADMIN },
      });

      const hashedPassword = await this.crypto.encrypt(password);

      if (!existsSuperadmin) {
        await this.prisma.admin.create({
          data: {
            username: username,
            hashedPassword,
            role: Roles.SUPERADMIN,
            phoneNumber: phNumber,
          },
        });

        console.log('Super admin created successfully');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error on creaeting super admin',
        error.message,
      );
    }
  }

  async createAdmin(dto: CreateAdminDto): Promise<ISuccess> {
    const { username, phoneNumber, password } = dto;
    const existsUsername = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (existsUsername) throw new ConflictException('Username already exists');

    const existsPhoneNumber = await this.prisma.admin.findFirst({
      where: { phoneNumber },
    });

    if (existsPhoneNumber)
      throw new ConflictException('Phone number already exists');

    const hashedPassword = await this.crypto.encrypt(password);

    const newAdmin = await this.prisma.admin.create({
      data: { username, phoneNumber, hashedPassword },
    });

    return successRes(newAdmin, 201);
  }
  async findOne(id: number): Promise<ISuccess> {
    const admin = await this.prisma.admin.findUnique({ where: { id } });

    if (!admin) throw new NotFoundException(`Admin not found`);

    return successRes(admin, 200);
  }

  async signIn(dto: SignInDto, res: Response): Promise<ISuccess> {
    const { username, password } = dto;
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    const isMatchPassword = await this.crypto.decrypt(
      password,
      admin?.hashedPassword || '',
    );
    if (!admin || !isMatchPassword) {
      throw new BadRequestException('Username or password incorrect');
    }
    if (admin.isActive === true || admin.isDeleted === true) {
      throw new ForbiddenException('This user is not active');
    }
    const payload: IToken = {
      id: admin.id,
      isActive: true,
      role: admin.role,
    };
    const accessToken = await this.jwt.accessToken(payload);
    const refreshToken = await this.jwt.refreshToken(payload);
    await this.jwt.writeCookie(res, 'adminToken', refreshToken, 15);

    return successRes({ token: accessToken });
  }

  async softDelete(id: number, dto: softDeleteDto): Promise<ISuccess> {
    const { data } = (await this.findOneById(id)) as any;

    if (data.role! == Roles.SUPERADMIN)
      throw new BadRequestException(`can't delete super admin`);

    let timeDeleted = data.timeDeleted;
    if (dto.isDeleted === true) {
      timeDeleted = new Date();
    } else if (dto.isDeleted === false) {
      timeDeleted = null;
    }

    const deleteData = await this.prisma.admin.update({
      where: { id },
      data: { ...dto, timeDeleted },
    });

    return successRes(deleteData, 200);
  }

  async updateAdmin(
    id: number,
    updateAdminDto: UpdateAdminDto,
    user: IToken,
  ): Promise<ISuccess> {
    const { username, password} = updateAdminDto;

    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (username) {
      const existsUsername = await this.prisma.admin.findUnique({
        where: { username },
      });
      if (existsUsername && existsUsername.id !== id) {
        throw new ConflictException('Username already exists');
      }
    }

    let data: any = {};

    if (username) {
      data.username = username;
    }

    if (user.role === Roles.SUPERADMIN) {
      if (password) {
        data.hashedPassword = await this.crypto.encrypt(password);
      }
    }

    const updatingAdmin = await this.prisma.admin.update({
      where: { id },
      data,
    });

    return successRes(updatingAdmin, 200);
  }

  async remove(id: number): Promise<ISuccess> {
    const { data } = (await this.findOneById(id)) as any;

    if (data.role! == Roles.SUPERADMIN)
      throw new BadRequestException(`can't delete super admin`);

    await this.prisma.admin.delete({ where: { id } });

    return successRes({}, 200);
  }
}
