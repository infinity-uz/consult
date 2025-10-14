import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment, PaymentStatus } from 'generated/prisma';
import { BookDoctorStatus } from 'src/common/enum/bookDoctor.status.enum';
import { PaymentType } from 'src/common/enum/payment.status.enum';
import { Roles } from 'src/common/enum/Roles.enum';
import { PrismaService } from 'src/core/prisma.service';
import { BaseService } from 'src/infrastructure/base/base.service';
import { successRes } from 'src/infrastructure/response/success';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { IToken } from 'src/infrastructure/token/interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment
> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.payment);
  }

  async createPayment(
    id: number,
    user: IToken,
    createPaymentDto: CreatePaymentDto,
  ): Promise<ISuccess> {
    const { walletId, paymentType, meetingDate, description } =
      createPaymentDto;

    const bookDoctor = await this.prisma.bookDoctor.findUnique({
      where: { id },
    });
    if (!bookDoctor) throw new NotFoundException('BookDoctor record not found');

    if (
      bookDoctor.status === BookDoctorStatus.CANCELLED ||
      bookDoctor.status === BookDoctorStatus.SUCCESS
    ) {
      throw new ConflictException('Invalid booking status');
    }

    if (bookDoctor.pateintsId !== user.id)
      throw new ForbiddenException('This booking does not belong to you');

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: bookDoctor.doctorId },
      include: { speciality: true },
    });
    if (!doctor || !doctor.isActive)
      throw new NotFoundException('Doctor not found or inactive');

    const service = await this.prisma.service.findUnique({
      where: { id: bookDoctor.serviceID },
      include: { doctor: true },
    });
    if (!service) throw new NotFoundException('Service not found');

    const patient = await this.prisma.pateints.findUnique({
      where: { id: user.id },
    });
    if (!patient) throw new NotFoundException('Patient not found');

    let payerWallet: any = null;
    if (paymentType === PaymentType.CARD) {
      payerWallet = await this.prisma.wallet.findFirst({
        where: { pateintsId: walletId },
      });

      if (!payerWallet) throw new ConflictException('Wallet not found');
      if (payerWallet.pateintsId !== user.id)
        throw new ForbiddenException('Wallet does not belong to this user');
      if (payerWallet.balance < service.price)
        throw new ConflictException('Insufficient wallet balance');
    }

    const doctorWallet = await this.prisma.wallet.findFirst({
      where: { doctorId: bookDoctor.doctorId },
    });

    let payment: any;

    await this.prisma.$transaction(async (tx) => {
      if (paymentType === PaymentType.CARD) {
        await tx.wallet.updateMany({
          where: { pateintsId: user.id },
          data: { balance: +payerWallet.balance - +service.price },
        });

        await tx.wallet.updateMany({
          where: { doctorId: bookDoctor.doctorId },
          data: { balance: +(doctorWallet?.balance ?? 0) + +service.price },
        });
      }

      await tx.bookDoctor.update({
        where: { id },
        data: { status: BookDoctorStatus.SUCCESS },
      });

      payment = await tx.payment.create({
        data: {
          status: PaymentStatus.PAID,
          pateintsName: patient.firstName,
          doctorName: doctor.firstName,
          amount: service.price,
          meetingDate,
          description,
          paymentType: paymentType,
          doctorBook: { connect: { id: bookDoctor.id } },
        },
      });
    });

    return successRes(payment, 201);
  }

  async cancelPayment(id: number, user: IToken): Promise<ISuccess> {
    const checkPayment = await this.prisma.payment.findUnique({
      where: { id },
      include: { doctorBook: true },
    });

    const doctorWallet = await this.prisma.wallet.findFirst({
      where: { doctorId: checkPayment?.doctorBook.doctorId },
    });

    const pateintsWallet = await this.prisma.wallet.findFirst({
      where: { pateintsId: checkPayment?.doctorBook.pateintsId },
    });

    if (!checkPayment || checkPayment.status === PaymentStatus.CANCELLED)
      throw new ConflictException('Payment not found or has been cancelled');

    if (
      user.role === Roles.PATEINTS &&
      user.id !== checkPayment.doctorBook.pateintsId
    )
      throw new ForbiddenException(`Forbidden user`);

    let payment: any;
    await this.prisma.$transaction(async (tx) => {
      if (checkPayment.paymentType === PaymentType.CARD) {
        await tx.wallet.updateMany({
          where: { pateintsId: user?.id ?? checkPayment.doctorBook.pateintsId },
          data: { balance: +pateintsWallet?.balance! + +checkPayment.amount },
        });

        await tx.wallet.updateMany({
          where: { doctorId: checkPayment.doctorBook.doctorId },
          data: {
            balance: +(doctorWallet?.balance ?? 0) - +checkPayment.amount,
          },
        });
      }

      await tx.bookDoctor.update({
        where: { id },
        data: { status: BookDoctorStatus.CANCELLED },
      });

      payment = await tx.payment.updateMany({
        where: { id },
        data: { status: PaymentStatus.CANCELLED },
      });
    });

    return successRes(payment);
  }

  async findOne(id: number, user: IToken): Promise<ISuccess> {
    const checkPayment = await this.prisma.payment.findFirst({
      where: { id },
      include: { doctorBook: true },
    });
    if (!checkPayment) throw new NotFoundException(`Not found Payment`);

    if (
      user.role === Roles.PATEINTS &&
      user.id !== checkPayment?.doctorBook.pateintsId
    )
      throw new ForbiddenException(`Forbidden user`);

    return this.findOneById(id);
  }

  async getPaymentsByPatient(id: number): Promise<ISuccess> {
    const payments = await this.prisma.payment.findMany({
      where: { doctorBook: { pateintsId: id } },
    });

    return successRes(payments);
  }

  async deletePayment(id: number): Promise<ISuccess> {
    const checkPayment = await this.prisma.payment.findFirst({
      where: { id },
      include: { doctorBook: true },
    });
    if (!checkPayment) throw new NotFoundException(`Not found Payment`);

    await this.prisma.payment.delete({ where: { id } });
    return successRes({});
  }
}
