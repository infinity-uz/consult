import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { adminData } from 'src/common/document/adminData';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';
import { paginationData } from 'src/common/document/paginationData';
import { type Response } from 'express';
import { SignInDto } from './dto/signIn.dto';
import { signInData } from 'src/common/document/signinData';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { AuthService } from '../auth/auth.service';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import { type IToken } from 'src/infrastructure/token/interface';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { SwaggerApi } from 'src/common/swagger/response.swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  // ------------------- CREATE -------------------
  @ApiOperation({ summary: 'Created admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData, HttpStatus.CREATED))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse(
      'Username already exists',
      HttpStatus.CONFLICT,
      409,
    ),
  )
  @AccessRoles(Roles.SUPERADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // ------------------- SIGNIN -------------------
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(signInData))
  @ApiResponse(SwaggerApi.ApiErrorResponse('Username or password encorect'))
  @AccessRoles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
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
  newToken(@CookieGetter('adminToken') token: string) {
    return this.authService.newToken('admin', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Post('signout')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('adminToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut('admin', token, res, 'adminToken');
  }

  // ----------- FIND ALL WITH PAGINATION -----------
  @ApiOperation({ summary: 'Find all admins with pagination' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(paginationData))
  @AccessRoles(Roles.SUPERADMIN)
  @Get()
  @ApiBearerAuth()
  async findAllWithPagination(@Query() query: PaginationQueryDto) {
    return this.adminService.findAllWithPagination({
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
    });
  }

  // ------------------- FIND ALL -------------------
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse([adminData]))
  @AccessRoles(Roles.SUPERADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.adminService.findAll({
      where: { role: Roles.ADMIN },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------- FIND BY ID -----------------
  @ApiOperation({ summary: 'Get admin by id' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Admin not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findbyId(@Param('id') id: number) {
    return this.adminService.findOne(id);
  }

  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Admin not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN)
  @Patch('softDelete:id')
  @ApiBearerAuth()
  softDelete(@Param('id') id: number, @Body() dto: softDeleteDto) {
    return this.adminService.softDelete(id, dto);
  }

  // ------------------- UPDATE -------------------
  @ApiOperation({ summary: 'Updating admin' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Admin not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAdminDto,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.adminService.updateAdmin(+id, dto, user);
  }

  // ------------------- DELETE -------------------
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse(adminData))
  @ApiResponse(
    SwaggerApi.ApiErrorResponse('Admin not found', HttpStatus.NOT_FOUND, 404),
  )
  @AccessRoles(Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.adminService.remove(id);
  }
}
