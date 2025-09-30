import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/core/prisma.service';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { Role } from 'generated/prisma';

@Injectable()
export class ChatService {
  constructor(private readonly prisma:PrismaService){}
  async create(createChatDto: CreateChatDto,complaintType:string) {
    const {doctorId,pateintsId,fromUserRole,toUserRole,...rest}=createChatDto;
    const doctor =await this.prisma.doctor.findUnique({where:{id:doctorId}})
    if(!doctor){
      throw new ConflictException("doctor not found")
    }
    const pateints=await this.prisma.pateints.findUnique({where:{id:pateintsId}})
    if(!pateints){
      throw new ConflictException("pateints not found")
    }
    if(fromUserRole===Role.DOCTOR || toUserRole===Role.DOCTOR){
      const doctor=await this.prisma.doctor.findFirst({where:{id:doctorId}})
      if(!doctor){
        throw new NotFoundException("bu iddagi doctor topilmadi")
      }
    }

    if(toUserRole===Role.PATEINTS || fromUserRole===Role.PATEINTS){
      const pateints=await this.prisma.pateints.findFirst({where:{id:pateintsId}})
      if(!pateints){
        throw new NotFoundException("bu iddagi pateints topilmadi")
      }
    }

    const newChat =await this.prisma



    


  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
