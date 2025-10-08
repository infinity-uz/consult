import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ComplaintType } from 'generated/prisma';
import { ApiOperation } from '@nestjs/swagger';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // -------------------- create update CHAT ----------------------------------------------

  @ApiOperation({ summary: "chat create" })
  @Post("chat")
  createChat(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto, ComplaintType.CHAT);
  }

  @ApiOperation({ summary: "chat update" })
  @Patch('chatupdate/:id')
  updateChat(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.CHAT);
  }

  // --------------------- create update comment -------------------------

  @ApiOperation({ summary: "comment create" })
  @Post("comment")
  createComment(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto, ComplaintType.COMMENT);
  }

  @ApiOperation({ summary: "comment update" })
  @Patch('commentupdate/:id')
  updateComment(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.COMMENT);
  }

  // --------------------- create update reason -------------------------

  @ApiOperation({ summary: "reason create" })
  @Post("reason")
  createReason(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto, ComplaintType.REASON);
  }

  @ApiOperation({ summary: "reason update" })
  @Patch('reasonupdate/:id')
  updateReason(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.REASON);
  }

  // --------------------- create update review -------------------------

  @ApiOperation({ summary: "review create" })
  @Post("review")
  createReview(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto, ComplaintType.REVIEW);
  }

  @ApiOperation({ summary: "review update" })
  @Patch('reviewupdate/:id')
  updateReview(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.REVIEW);
  }
  
  // --------------------- create update complaint -------------------------

  @ApiOperation({ summary: "complaint create" })
  @Post("complaint")
  createComplaint(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto, ComplaintType.COMPLAINT);
  }

  @ApiOperation({ summary: "complaint update" })
  @Patch('complaintupdate/:id')
  updateComplaint(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.COMPLAINT);
  }



  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}