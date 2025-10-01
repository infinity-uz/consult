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

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ------------------- CREATE -------------------
  @ApiOperation({ summary: 'Created admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: adminData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Failed creating admin',
    schema: {
      example: {
        statusCode: 409,
        error: {
          message: 'Username already exists',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // ------------------- SIGNIN -------------------
  @ApiOperation({ summary: 'Created admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Administrator signed successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: signInData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed signin admin',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'Username  or password incorect',
        },
      },
    },
  })
  @AccessRoles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.adminService.signIn(signInDto, res);
  }

  // ----------- FIND ALL WITH PAGINATIO -----------
  @ApiOperation({ summary: 'Find all admins with pagination' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'All admins get successfully with pagination',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: paginationData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error on get admins',
    schema: {
      example: {
        statusCode: 500,
        error: {
          message: 'Internal server error',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN)
  @Get()
  @ApiBearerAuth()
  async findAll(@Query() query: PaginationQueryDto) {
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
}
