import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { BookDoctorStatus } from 'src/common/enum/bookDoctor.status.enum';
import { Roles } from 'src/common/enum/Roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import type { IToken } from 'src/infrastructure/token/interface';
import { BookDoctorService } from './book_doctor.service';

import {
  SwaggerRelatedToChangeStatus,
  SwaggerRelatedToCreate,
  SwaggerRelatedToDelete,
  SwaggerRelatedToFindAll,
  SwaggerRelatedToFindOne,
  SwaggerRelatedToUpdate,
} from 'src/common/swagger/book_doctor.swagger';
import { CreateBookDoctorDto } from './dto/create-book_doctor.dto';
import { UpdateBookDoctorDto } from './dto/update-book_doctor.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('book-doctor')
export class BookDoctorController {
  constructor(private readonly bookDoctorService: BookDoctorService) {}

  // =================== CREATE ===================
  @SwaggerRelatedToCreate()
  @AccessRoles(Roles.PATEINTS, Roles.ADMIN, Roles.SUPERADMIN)
  @Post()
  @ApiBearerAuth()
  create(
    @Body() createBookDoctorDto: CreateBookDoctorDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.bookDoctorService.createBook(createBookDoctorDto, user);
  }

  // =================== GET ALL ===================
  @SwaggerRelatedToFindAll()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Get('all')
  @ApiBearerAuth()
  getAllBookings() {
    return this.bookDoctorService.findAll();
  }

  // =================== GET BY ID ===================
  @SwaggerRelatedToFindOne()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.DOCTOR, Roles.PATEINTS)
  @Get(':id')
  @ApiBearerAuth()
  getBookingById(
    @Param('id') id: string,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.bookDoctorService.findOneBookDoctor(+id, user);
  }

  // =================== GET BY USER ( Doctor or Patient ) ===================
  @SwaggerRelatedToFindAll()
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Get('patient/:id')
  @ApiBearerAuth()
  getBookingsByPatient(
    @Param('id') id: string,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.bookDoctorService.getBookingsByUser(+id, user);
  }

  // =================== UPDATE booking ===================
  @SwaggerRelatedToUpdate()
  @AccessRoles(Roles.PATEINTS)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateBookDoctorDto: UpdateBookDoctorDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.bookDoctorService.updateBookDoctor(
      +id,
      updateBookDoctorDto,
      user,
    );
  }

  // =================== CHANGE STATUS ===================
  @SwaggerRelatedToChangeStatus()
  @AccessRoles(Roles.DOCTOR, Roles.SUPERADMIN, Roles.ADMIN)
  @Patch(':id/status/:status')
  @ApiBearerAuth()
  updateBookingStatus(
    @Param('id') id: string,
    @Param('status')
    status: BookDoctorStatus.CANCELLED | BookDoctorStatus.PROCESS,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.bookDoctorService.updateBookingStatus(+id, user, status);
  }

  // =================== DELETE booking (only admin) ===================
  @SwaggerRelatedToDelete()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  deleteBooking(@Param('id') id: string) {
    return this.bookDoctorService.remove(+id);
  }
}
