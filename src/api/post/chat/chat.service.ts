import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/core/prisma.service';
import { Chat, ChatRating, ComplaintType, Role } from 'generated/prisma';
import { IToken } from 'src/infrastructure/token/interface';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';


@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }


  // -------------------- CREATE UPDATE CHAT REASON ----------------------------------------------

  async create(createChatDto: CreateChatDto, complaintType: ComplaintType, user: IToken) {
    const { userId, comments } = createChatDto;

    let fromUserRole: Role;
    let toUserRole: Role;
    let toUserId: number;
    let fromUserId: number;
    let doctorId: number;
    let pateintsId: number;

    if (user.role == Role.PATEINTS) {
      fromUserId = user.id
      fromUserRole = user.role;
      pateintsId = user.id;
      const sherik = await this.prisma.doctor.findUnique({ where: { id: userId } })
      if (!sherik) throw new NotFoundException("doctor topilmadi")
      toUserId = sherik.id
      toUserRole = Role.DOCTOR;
      doctorId = sherik.id;
    } else {
      fromUserId = user.id
      fromUserRole = Role.DOCTOR;
      doctorId = user.id;
      const sherik = await this.prisma.pateints.findUnique({ where: { id: userId } })
      if (!sherik) throw new NotFoundException("pateints topilmadi")
      toUserId = sherik.id
      toUserRole = Role.PATEINTS;
      pateintsId = sherik.id;
    }

    const newChat = await this.prisma.chat.create({
      data:
      {
        comments,
        doctorId,
        pateintsId,
        fromUserId,
        toUserId,
        fromUserRole,
        toUserRole,
        complaint: complaintType
      }
    })

    return newChat;
  }

  async update(id: number, updateChatDto: UpdateChatDto, complaintType: ComplaintType) {
    await this.findOne(id);
    return this.prisma.chat.update({ where: { id }, data: { ...updateChatDto, complaint: complaintType } })
  }

  // --------------------- CREATE UPDATE COMMENT -------------------------

  async createComment(createChatDto: CreateChatDto, complaintType: ComplaintType, user: IToken) {
    const { userId, comments } = createChatDto;

    let fromUserRole: Role;
    let toUserRole: Role;
    let toUserId: number;
    let fromUserId: number;
    let doctorId: number;
    let pateintsId: number;


    fromUserId = user.id
    fromUserRole = Role.PATEINTS;
    pateintsId = user.id;
    const sherik = await this.prisma.doctor.findUnique({ where: { id: userId } })
    if (!sherik) throw new NotFoundException("doctor topilmadi")
    toUserId = sherik.id
    toUserRole = Role.DOCTOR;
    doctorId = sherik.id;


    const newComment = await this.prisma.chat.create({
      data:
      {
        comments,
        doctorId,
        pateintsId,
        fromUserId,
        toUserId,
        fromUserRole,
        toUserRole,
        complaint: complaintType
      }
    })

    return newComment;
  }

  async updateComment(id: number, updateChatDto: UpdateChatDto, complaintType: ComplaintType) {
    await this.findOne(id);
    return this.prisma.chat.update({ where: { id }, data: { ...updateChatDto, complaint: complaintType } })
  }

  // --------------------- CREATE UPDATE REVIEW -------------------------

  async createReview(createChatDto: CreateReviewDto, complaintType: ComplaintType, user: IToken) {
    const { userId, comments,rating } = createChatDto;

    let fromUserRole: Role;
    let toUserRole: Role;
    let toUserId: number;
    let fromUserId: number;
    let doctorId: number;
    let pateintsId: number;

  

    fromUserId = user.id
    fromUserRole = Role.PATEINTS;
    pateintsId = user.id;
    const sherik = await this.prisma.doctor.findUnique({ where: { id: userId } })
    if (!sherik) throw new NotFoundException("doctor topilmadi")
    toUserId = sherik.id
    toUserRole = Role.DOCTOR;
    doctorId = sherik.id;



    const newComment = await this.prisma.chat.create({
      data:
      {
        comments,
        doctorId,
        pateintsId,
        fromUserId,
        toUserId,
        fromUserRole,
        toUserRole,
        complaint: complaintType,
        rating
      }
    })

    return newComment;
  }

  async updateReview(id: number, updateChatDto: UpdateReviewDto, complaintType: ComplaintType) {
    await this.findOne(id);
    return this.prisma.chat.update({ where: { id }, data: { ...updateChatDto, complaint: complaintType } })
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



  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.chat.delete({ where: { id } })
    return {}
  }
}
