import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ComplaintType } from 'generated/prisma';
import { ApiOperation } from '@nestjs/swagger';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

// -------------------- CREATE CHAT ----------------------------------------------

  @ApiOperation({summary:"chat create"})
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto,ComplaintType.CHAT);
  }
  

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
