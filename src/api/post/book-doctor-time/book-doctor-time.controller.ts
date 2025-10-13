import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { BookDoctorTimeService } from './book-doctor-time.service';
import { CreateBookDoctorTimeDto } from './dto/create-book-doctor-time.dto';
import { UpdateBookDoctorTimeDto } from './dto/update-book-doctor-time.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';


@ApiTags("BookDoctorTime")
@Controller('book-doctor-time')
export class BookDoctorTimeController {
  constructor(private readonly bookDoctorTimeService: BookDoctorTimeService) {}



  @Post()
  @ApiOperation({summary:"create BookDoctortime ",description:"doctor yoki admin"})
  @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'bookDoctorTime created',
      schema: {
        example: {
          statusCode: 201,
          message: 'success',
        },
      },
    })
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @AccessRoles(Roles.ADMIN,Roles.DOCTOR, Roles.SUPERADMIN)
  create(@Body() createBookDoctorTimeDto: CreateBookDoctorTimeDto) {
    return this.bookDoctorTimeService.create(createBookDoctorTimeDto);
  }




  @Get()
  @ApiOperation({summary:" royhatini olish"})
  @ApiResponse({status:200,description:"bookDoctorTime royxatlari "})
  findAll() {
    return this.bookDoctorTimeService.findAll();
  }



  @Get(':id')
  @ApiOperation({ summary: "ID bo'yicha BookDoctorTime olish" })
  @ApiResponse({ status: 200, description: 'BookDoctorTime topildi' })
  findOne(@Param('id') id: string) {
    return this.bookDoctorTimeService.findOne(+id);
  }



  @Patch(':id')
  @ApiResponse({ status: 200, description: 'BookDoctorTime ni yangilash' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @AccessRoles(Roles.ADMIN,Roles.DOCTOR, Roles.SUPERADMIN)
  update(@Param('id') id: string, @Body() updateBookDoctorTimeDto: UpdateBookDoctorTimeDto) {
    return this.bookDoctorTimeService.update(+id, updateBookDoctorTimeDto);
  }




  @Patch('soft/:id')
  @ApiOperation({ summary: "is delete BookDoctorTime  (soft-delete)"})
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @AccessRoles(Roles.ADMIN,Roles.DOCTOR, Roles.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.bookDoctorTimeService.remove(+id);
  }




  @Delete(':id')
  @ApiOperation({ summary: "is delete BookDoctorTime  (hard-delete)"})
  @ApiBearerAuth()
  @UseGuards(AuthGuard,RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  delete(@Param('id') id: string) {
    return this.bookDoctorTimeService.delete(+id);
  }
}
