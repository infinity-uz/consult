import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDoctorTimeDto } from './dto/create-book-doctor-time.dto';
import { UpdateBookDoctorTimeDto } from './dto/update-book-doctor-time.dto';
import { PrismaService } from 'src/core/prisma.service';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class BookDoctorTimeService {
  constructor(private readonly prisama: PrismaService) { }

  async create(createBookDoctorTimeDto: CreateBookDoctorTimeDto) {
    const { doctorId, ...rest } = createBookDoctorTimeDto;


    const doctor = await this.prisama.doctor.findMany({ where: { id: { in: doctorId } } })
    if (doctor.length !== doctorId.length) {
      throw new ConflictException("doctor id lardan biri topilmadi")
    }


    const { date, startTime, finishTime } = createBookDoctorTimeDto;


    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [finishHour, finishMinute] = finishTime.split(':').map(Number);

    const start = startHour * 60 + startMinute;
    const finish = finishHour * 60 + finishMinute;

    if (finish <= start) {
      throw new ConflictException("Tugash vaqti boshlanish vaqtidan keyin bolishi kerak");
    }


    const workStart = 9 * 60;   
    const workEnd = 18 * 60;    

    if (start < workStart || finish > workEnd) {
      throw new ConflictException(
        "Ish vaqti tugagan. Sizga hizmat korsatishini hohlasangiz, doktoringiz bilan alohida boglaning"
      );
    }



    const conflict = await this.prisama.bookDoctorTime.findFirst({
      where: {
        doctor: { some: { id: { in: doctorId } } },
        date: date,
        OR: [
          { startTime: { lte: finishTime }, finishTime: { gte: startTime } }
        ]
      }
    });

    if (conflict) {
      throw new ConflictException("Bu vaqt oraligi allaqachon band qilingan");
    }

    const data = await this.prisama.bookDoctorTime.create({
      data: { ...rest, doctor: { connect: doctor.map((d) => ({ id: d.id })) } },
      include: { doctor: true }

    })
    return successRes(data, 201);

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
    return successRes(doctortime, 200)
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

    const updateBook = this.prisama.bookDoctorTime.update({
      where: { id },
      data: { ...rest, doctor: { connect: doctors!.map((d) => ({ id: d.id })) } },
      include: { doctor: true }
    })

    return successRes(updateBook, 200)

  }

  async remove(id: number) {
    await this.findOne(id);
    const softDelete = this.prisama.bookDoctorTime.update({
      where: { id },
      data: {
        isDeleted: true,
        timeDeleted: new Date(),
      },
    });
    return successRes(softDelete, 200)

  }



  async delete(id: number) {
    await this.findOne(id);

    await this.prisama.bookDoctorTime.delete({
      where: { id },

    });
    return successRes({}, 200)
  }

}
