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
import { PateintService } from './pateint.service';
import { UpdatePateintDto } from './dto/update-pateint.dto';
import { AuthService } from '../auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/Roles.enum';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { type Response } from 'express';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { RegisterPateintDto } from './dto/register-pateint.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { SwaggerApi } from 'src/common/swagger/response.swagger';
import { patientData } from 'src/common/document/patientData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('pateint')
export class PateintController {
  constructor(
    private readonly pateintService: PateintService,
    private readonly authService: AuthService,
  ) {}

  // ------------------- REGISTER -------------------
  @ApiOperation({
    summary: 'Register',
  })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(patientData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse(
      'Phone number already exists',
      HttpStatus.CONFLICT,
      409,
    ),
  )
  @AccessRoles('public')
  @Post('register')
  register(@Body() dto: RegisterPateintDto) {
    return this.pateintService.registerPAteint(dto);
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
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Post('token')
  @ApiBearerAuth()
  newToken(@CookieGetter('pateintToken') token: string) {
    return this.authService.newToken('pateints', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out pateint' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @AccessRoles(Roles.PATEINTS)
  @Post('signout')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('pateintToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut('pateints', token, res, 'pateintToken');
  }

  // ----------- FIND ALL WITH PAGINATION -----------
  @ApiOperation({ summary: 'Find all pateints with pagination' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([patientData]))
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  async findAllWithPagination(@Query() query: PaginationQueryDto) {
    return this.pateintService.findAllWithPagination({
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
  @ApiOperation({ summary: 'Get all pateints' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([patientData]))
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.pateintService.findAll({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------- FIND BY ID -----------------
  @ApiOperation({ summary: 'Get pateint by id' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(patientData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Patient not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findbyId(@Param('id') id: number) {
    return this.pateintService.findOneById(id);
  }

  // ------------------- UPDATE -------------------
  @ApiOperation({ summary: 'Updating patient' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(patientData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Patient not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: UpdatePateintDto) {
    return this.pateintService.updatePatient(+id, dto);
  }

  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete and activate patient' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(patientData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Patient not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch('softDelete:id')
  @ApiBearerAuth()
  softDelete(@Param('id') id: number, @Body() dto: softDeleteDto) {
    return this.pateintService.softDelete(id, dto);
  }
}
