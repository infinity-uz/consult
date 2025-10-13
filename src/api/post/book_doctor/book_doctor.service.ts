import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookDoctor } from 'generated/prisma';
import { BookDoctorStatus } from 'src/common/enum/bookDoctor.status.enum';
import { Roles } from 'src/common/enum/Roles.enum';
import { PrismaService } from 'src/core/prisma.service';
import { BaseService } from 'src/infrastructure/base/base.service';
import { successRes } from 'src/infrastructure/response/success';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { IToken } from 'src/infrastructure/token/interface';
import { CreateBookDoctorDto } from './dto/create-book_doctor.dto';
import { UpdateBookDoctorDto } from './dto/update-book_doctor.dto';

@Injectable()
export class BookDoctorService extends BaseService<
  CreateBookDoctorDto,
  UpdateBookDoctorDto,
  BookDoctor
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.bookDoctor);
  }
  private isUser(bookDoctor: any, user: IToken) {
    const { role } = user;
    const isAdmin = role === Roles.ADMIN || role === Roles.SUPERADMIN;
    const isDoctorOwner =
      role === Roles.DOCTOR && bookDoctor?.doctorId === user.id;
    const isPatients =
      role === Roles.PATEINTS && bookDoctor?.pateintsId === user.id;

    return [
      !isAdmin && !isDoctorOwner,
      !isAdmin && !isDoctorOwner && !isPatients,
    ];
  }

  async createBook(
    createBookDoctorDto: CreateBookDoctorDto,
    user: IToken,
  ): Promise<ISuccess> {
    const { serviceID, doctorId, specialityId } = createBookDoctorDto;
    const checkPateints = await this.prisma.pateints.findUnique({
      where: { id: user.id },
    });
    if (!checkPateints || checkPateints.isActive == false)
      throw new NotFoundException(`Not found pateints`);

    const checkDoctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { speciality: true },
    });
    if (!checkDoctor || checkDoctor.isActive == false)
      throw new NotFoundException(`Not found doctor`);

    const checkService = await this.prisma.service.findUnique({
      where: { id: serviceID },
      include: { doctor: true },
    });
    if (!checkService) throw new NotFoundException(`Not found service`);

    const checkSpeciality = await this.prisma.speciality.findUnique({
      where: { id: specialityId },
      include: { doctor: true },
    });
    if (!checkSpeciality || checkSpeciality.isActive == false)
      throw new NotFoundException(`Not found speciality`);

    if (
      checkDoctor.servicesId !== serviceID ||
      checkDoctor.speciality.includes(checkSpeciality)
    )
      throw new ConflictException(
        `Data doesn't match ( Docotor, Service, Speciality )`,
      );

    const booking = await this.prisma.bookDoctor.create({
      data: { ...createBookDoctorDto, pateintsId: user.id },
    });

    return successRes(booking, 201);
  }

  async updateBookingStatus(
    id: number,
    user: IToken,
    status: BookDoctorStatus.PROCESS | BookDoctorStatus.CANCELLED,
  ): Promise<ISuccess> {
    const { role } = user;
    const { PROCESS, PENDING, CANCELLED } = BookDoctorStatus;

    const checkBookDoctor = await this.prisma.bookDoctor.findFirst({
      where: { id },
    });

    if (!checkBookDoctor) {
      throw new ConflictException('BookDoctor not found');
    }

    const isAuthorized = this.isUser(checkBookDoctor, user);

    // ROLE check
    if (status === PROCESS) {
      if (isAuthorized[0]) {
        throw new ForbiddenException('Forbidden user');
      }
      if (checkBookDoctor.status !== PENDING) {
        throw new ConflictException(
          `BookDoctor must be PENDING, but got ${checkBookDoctor.status}`,
        );
      }
    }

    if (status === CANCELLED) {
      if (isAuthorized[1]) {
        throw new ForbiddenException('Forbidden user');
      }
      if (checkBookDoctor.status === CANCELLED) {
        throw new ConflictException('Book doctor has already been cancelled');
      }
    }

    const updatedBookDoctor = await this.prisma.bookDoctor.update({
      where: { id },
      data: {
        ...checkBookDoctor,
        status,
        isActive: status == PROCESS,
      },
    });

    return successRes(updatedBookDoctor);
  }

  async updateBookDoctor(
    id: number,
    updateBookDoctorDto: UpdateBookDoctorDto,
    user: IToken,
  ): Promise<ISuccess> {
    const { serviceID, specialityId, doctorId } = updateBookDoctorDto;

    let checkBookDoctor = await this.prisma.bookDoctor.findFirst({
      where: { id },
    });

    if (!checkBookDoctor) {
      throw new ConflictException('BookDoctor not found');
    }

    const isAuthorized = this.isUser(checkBookDoctor, user)[1];
    if (isAuthorized) throw new ForbiddenException('Forbidden user');

    if (serviceID || specialityId || doctorId)
      if (
        checkBookDoctor.status == BookDoctorStatus.CANCELLED ||
        checkBookDoctor.status == BookDoctorStatus.SUCCESS
      )
        throw new BadRequestException(`Prohibited activity`);
      else
        await this.prisma.bookDoctor.update({
          where: { id },
          data: { ...checkBookDoctor, status: BookDoctorStatus.CANCELLED },
        });
    const {
      id: _,
      isActive,
      isDeleted,
      createdAt,
      updatedAt,
      timeDeleted,
      status,
      pateintsId,
      ...bookDoctorWithout
    } = checkBookDoctor;

    const newBookDoctor = {
      ...bookDoctorWithout,
      ...updateBookDoctorDto,
      serviceID: serviceID ? serviceID : checkBookDoctor.serviceID,
      specialityId: specialityId ? specialityId : checkBookDoctor.specialityId,
      doctorId: doctorId ? doctorId : checkBookDoctor.doctorId,
    };

    return await this.createBook(newBookDoctor, user);
  }

  async remove(id: number): Promise<ISuccess> {
    const checkBookDoctor = await this.prisma.bookDoctor.findUnique({
      where: { id },
    });
    if (!checkBookDoctor) throw new NotFoundException(`BookDoctor not found`);

    return this.delete(id);
  }

  async findOneBookDoctor(id: number, user: IToken): Promise<ISuccess> {
    const checkBookDoctor = await this.prisma.bookDoctor.findUnique({
      where: { id },
      include: {
        service: true,
        speciality: true,
        doctor: true,
        pateints: true,
      },
    });
    if (!checkBookDoctor) throw new NotFoundException(`BookDoctor not found`);

    const isAuthorized = this.isUser(checkBookDoctor, user)[1];
    if (isAuthorized) throw new ForbiddenException('Forbidden user');
    return successRes(checkBookDoctor);
  }

  async getBookingsByUser(id: number, user: IToken) {
    const where =
      user.role === Roles.PATEINTS ? { pateintsId: id } : { doctorId: id };
    const checkUser = await this.prisma.bookDoctor.findMany({
      where,
      include: { service: true, speciality: true },
    });

    if (!checkUser)
      throw new NotFoundException(`No bookings were found for the user.`);

    return successRes(checkUser);
  }
}
