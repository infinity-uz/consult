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

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

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
  @ApiOperation({ summary: 'Sign in admin' })
  @ApiResponse({
    status: HttpStatus.OK,
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

  // ---------------- NEW TOKEN ----------------
  @ApiOperation({
    summary: 'Get new access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'New access token get successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {
          token: 'aslksfjo2i3n4n2309idsfn2i3jo423lj423kj',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'Refresh token expired',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Post('token')
  @ApiBearerAuth()
  newToken(@CookieGetter('adminToken') token: string) {
    return this.authService.newToken('admin', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Administrator sign out successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Failed sign out admin',
    schema: {
      example: {
        statusCode: 401,
        error: {
          message: 'Refresh token not found',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admins get successfully with pagination',
    schema: {
      example: {
        statusCode: 200,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All admins get successfully ',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: [adminData],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Failed get admins',
    schema: {
      example: {
        statusCode: 403,
        error: {
          message: 'Forbidden user',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get admin by id successfully ',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: adminData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Failed get admin by id',
    schema: {
      example: {
        statusCode: 403,
        error: {
          message: 'Forbidden user',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findbyId(@Param('id') id: number) {
    return this.adminService.findOne(id);
  }

  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft delete admin',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: adminData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed soft delete admin',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Not found',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN)
  @Patch('softDelete:id')
  @ApiBearerAuth()
  softDelete(@Param('id') id: number, @Body() dto: softDeleteDto) {
    return this.adminService.softDelete(id, dto);
  }

  // ------------------- UPDATE -------------------
  @ApiOperation({ summary: 'Updating admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updating admin',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: adminData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed updating admin',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Not found',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAdminDto,
    @GetRequestUser('user') user: IToken,
  ) {
    console.log(id);
    return this.adminService.updateAdmin(+id, dto, user);
  }

  // ------------------- DELETE -------------------
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete admin',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed delete admin',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Not found',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  delete(@Param('id') id: number) {
    return this.adminService.remove(id);
  }
}
