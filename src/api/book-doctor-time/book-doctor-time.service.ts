import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorTimeDto } from './dto/create-book-doctor-time.dto';
import { UpdateBookDoctorTimeDto } from './dto/update-book-doctor-time.dto';
import { PrismaService } from 'src/core/prisma.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { timeoutProvider } from 'rxjs/internal/scheduler/timeoutProvider';
import { utimes } from 'fs';

@Injectable()
export class BookDoctorTimeService {
  constructor(private readonly prisama: PrismaService) { }

  async create(createBookDoctorTimeDto: CreateBookDoctorTimeDto) {
    const { doctorId, ...rest } = createBookDoctorTimeDto;
    
    const doctor = await this.prisama.doctor.findMany({ where: { id: { in: doctorId } } })
    if (doctor.length !== doctorId.length) {
      throw new ConflictException("doctor id lardan biri topilmadi")
    }

    const data = await this.prisama.bookDoctorTime.create({
      data: { ...rest, doctor: { connect: doctor.map((d) => ({ id: d.id })) } },
      include: { doctor: true }

    })
    return data;

  }

  async findAll() {
    return await this.prisama.bookDoctorTime.findMany({
      where: { isDeleted: false },
      include: { doctor: true }
    })
  }

  async findOne(id: number) {
    const doctortime = await this.prisama.bookDoctorTime.findUnique({
      where: { id },
      include: { doctor: true }
    })
    if (!doctortime || doctortime.isDeleted) {
      throw new NotFoundException("bookDoctorTime id topilmadi")
    }
    return doctortime
  }

  async update(id: number, updateBookDoctorTimeDto: UpdateBookDoctorTimeDto) {
    const { doctorId, ...rest } = updateBookDoctorTimeDto;
    const data = await this.prisama.bookDoctorTime.findUnique({ where: { id }, include: { doctor: true } })
    let doctors = data?.doctor;

    if (doctorId) {
      const doctor = await this.prisama.doctor.findMany({ where: { id: { in: doctorId } } })
      if (doctor.length !== doctorId.length) {
        throw new ConflictException("doctor id lardan biri topilmadi")
      }
      doctors = doctor
    }

    return this.prisama.bookDoctorTime.update({
      where: { id },
      data: { ...rest, doctor: { connect: doctors!.map((d) => ({ id: d.id })) } },
      include: { doctor: true }
    })

  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisama.bookDoctorTime.update({
      where: { id },
      data: {
        isDeleted: true,
        timeDeleted: new Date(),
      },
    });
  }

  async delete(id: number) {
    await this.findOne(id);

    await this.prisama.bookDoctorTime.delete({
      where: { id },

    });
    return {}
  }

}
