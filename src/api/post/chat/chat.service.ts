import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/core/prisma.service';
import { ComplaintType, Role } from 'generated/prisma';
import { toUSVString } from 'util';
import { not } from 'rxjs/internal/util/not';
import { retry } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createChatDto: CreateChatDto, complaintType: ComplaintType) {
    const { doctorId, pateintsId, fromUserRole, toUserRole, ...rest } = createChatDto;

    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } })
    if (!doctor) {
      throw new ConflictException("doctor not found")
    }
    const pateints = await this.prisma.pateints.findUnique({ where: { id: pateintsId } })
    if (!pateints) {
      throw new ConflictException("pateints not found")
    }

    let fromUserId: number;
    let toUserId: number;


    if (toUserRole === Role.DOCTOR) {
      toUserId = doctor.id;
    } else if (toUserRole === Role.PATEINTS) {
      toUserId = pateints.id;
    } else {
      throw new ConflictException("toUserRole notogri");
    }


    if (fromUserRole === Role.DOCTOR) {
      fromUserId = doctor.id;
    } else if (fromUserRole === Role.PATEINTS) {
      fromUserId = pateints.id;
    } else {
      throw new ConflictException("fromUserRole notogri");
    }

    const newChat = await this.prisma.chat.create({
      data:
      {
        ...rest,
        fromUserId,
        toUserId, pateintsId,
        doctorId,
        fromUserRole,
        toUserRole,
        complaint: complaintType
      }
    })

    return newChat;
  }

  findAll() {
    return this.prisma.chat.findMany({ include: { pateints: true, doctor: true } })
  }

  async findOne(id: number) {
    const data = await this.prisma.chat.findUnique({ where: { id }, include: { pateints: true, doctor: true } })
    if (!data) {
      throw new NotFoundException("chat not found")
    }
    return data;
  }

  async update(id: number, updateChatDto: UpdateChatDto,complaintType:ComplaintType) {
    await this.findOne(id);
    return this.prisma.chat.update({where:{id},data:{...updateChatDto,complaint:complaintType}})
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.chat.delete({ where: { id } })
    return {}
  }
}
