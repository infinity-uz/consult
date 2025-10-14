import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ComplaintType, Role } from 'generated/prisma';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import type { IToken } from 'src/infrastructure/token/interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  // -------------------- CREATE UPDATE CHAT ----------------------------------------------

  @ApiOperation({ summary: "chat create" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.PATEINTS)
  @Post("chat")
  @ApiBearerAuth()
  createChat(@Body() createChatDto: CreateChatDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.create(createChatDto, ComplaintType.CHAT, user);
  }

  @ApiOperation({ summary: "chat update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.DOCTOR, Roles.PATEINTS)
  @Patch('chatupdate/:id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.CHAT, );
  }

  // --------------------- CREATE UPDATE COMMENT -------------------------

  @ApiOperation({ summary: "comment create" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Post("comment")
  @ApiBearerAuth()
  createComment(@Body() createChatDto: CreateChatDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.createComment(createChatDto, ComplaintType.COMMENT, user);
  }

  @ApiOperation({ summary: "comment update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Patch('commentupdate/:id')
  @ApiBearerAuth()
  updateComment(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.updateComment(+id, updateChatDto, ComplaintType.COMMENT);
  }

  // --------------------- CREATE UPDATE REASON -------------------------

  @ApiOperation({ summary: "reason create" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS, Role.DOCTOR)
  @Post("reason")
  @ApiBearerAuth()
  createReason(@Body() createChatDto: CreateChatDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.create(createChatDto, ComplaintType.REASON, user);
  }

  @ApiOperation({ summary: "reason update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS, Role.DOCTOR)
  @Patch('reasonupdate/:id')
  @ApiBearerAuth()
  updateReason(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto, ComplaintType.REASON);
  }

  // --------------------- CREATE UPDATE REVIEW -------------------------

  @ApiOperation({ summary: "review create" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Post("review")
  @ApiBearerAuth()
  createReview(@Body() createChatDto: CreateReviewDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.createReview(createChatDto, ComplaintType.REVIEW, user);
  }

  @ApiOperation({ summary: "review update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Patch('reviewupdate/:id')
  @ApiBearerAuth()
  updateReview(@Param('id') id: string, @Body() updateChatDto: UpdateReviewDto) {
    return this.chatService.updateReview(+id, updateChatDto, ComplaintType.REVIEW);
  }

  // --------------------- CREATE UPDATE COMLAINT -------------------------

  @ApiOperation({ summary: "complaint create" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Post("complaint")
  @ApiBearerAuth()
  createComplaint(@Body() createChatDto: CreateChatDto, @GetRequestUser('user') user: IToken) {
    return this.chatService.createComment(createChatDto, ComplaintType.COMPLAINT, user);
  }

  @ApiOperation({ summary: "complaint update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.PATEINTS)
  @Patch('complaintupdate/:id')
  @ApiBearerAuth()
  updateComplaint(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.updateComment(+id, updateChatDto, ComplaintType.COMPLAINT);
  }


// ------------- UMUMIY --------------------------------

  @ApiOperation({ summary: "complaint update" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Role.SUPERADMIN,Role.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.chatService.findAll();
  }

  @ApiOperation({ summary: "update ny id from chat table" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Role.SUPERADMIN,Role.ADMIN)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @ApiOperation({ summary: "delete by id from chat table" })
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Role.SUPERADMIN,Role.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}