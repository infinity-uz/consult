import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { type Response } from 'express';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { SwaggerApi } from 'src/common/swagger/response.swagger';
import { doctorData } from 'src/common/document/doctorData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly authService: AuthService,
  ) {}
  // ------------------- REGISTER -------------------
  @ApiOperation({
    summary: 'Register',
  })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(doctorData, HttpStatus.OK))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse(
      'Phone number already exists',
      HttpStatus.CONFLICT,
      409,
    ),
  )
  @AccessRoles('public')
  @Post('register')
  register(@Body() dto: RegisterDoctorDto) {
    return this.doctorService.registerDoctor(dto);
  }

  // ---------------- NEW TOKEN ----------------
  @ApiOperation({
    summary: 'Get new access token',
  })
  @ApiResponse(
    SwaggerApi.ApiSuccessResponse({
      data: {
        token: 'aslksfjo2i3n4n2309idsfn2i3jo423lj423kj',
      },
    }),
  )
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('forbidden user', HttpStatus.FORBIDDEN, 403),
  )
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Post('token')
  @ApiBearerAuth()
  newToken(@CookieGetter('doctorToken') token: string) {
    return this.authService.newToken('doctor', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out doctor' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @ApiResponse(
    SwaggerApi.ApiErrorResponse(
      'Refresh token not found',
      HttpStatus.UNAUTHORIZED,
      401,
    ),
  )
  @AccessRoles(Roles.DOCTOR)
  @Post('signout')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('doctorToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut('doctor', token, res, 'doctorToken');
  }

  // ----------- FIND ALL WITH PAGINATION -----------
  @ApiOperation({ summary: 'Find all doctors with pagination' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([doctorData], HttpStatus.OK))
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  async findAllWithPagination(@Query() query: PaginationQueryDto) {
    return this.doctorService.findAllWithPagination({
      where: query.query
        ? {
            username: {
              contains: query.query,
              mode: 'insensitive',
            },
          }
        : {},
      page: query.page,
      pageSize: query.pageSize,
      orderBy: { createdAt: 'desc' },
      relations: {
        services: true,
      },
    });
  }

  // ------------------- FIND ALL -------------------
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([doctorData], HttpStatus.OK))
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.doctorService.findAll({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------- FIND BY ID -----------------
  @ApiOperation({ summary: 'Get doctor by id' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(doctorData, HttpStatus.OK))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Doctor not found0', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findbyId(@Param('id') id: number) {
    return this.doctorService.findOneById(id);
  }

  // ------------------- UPDATE -------------------
  @ApiResponse(SwaggerApi.ApiSuccessResponse(doctorData, HttpStatus.OK))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Doctor not found0', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.updateDoctor(+id, dto);
  }

  // --------------- SOFT DELETE ------------------
  @ApiResponse(SwaggerApi.ApiSuccessResponse(doctorData, HttpStatus.OK))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Doctor not found0', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch('softDelete:id')
  @ApiBearerAuth()
  softDelete(@Param('id') id: number, @Body() dto: softDeleteDto) {
    return this.doctorService.softDelete(id, dto);
  }

  // ------------------- DELETE -------------------
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Doctor not found0', HttpStatus.NOT_FOUND, 404),
  )
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Doctor not found0', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }
}
