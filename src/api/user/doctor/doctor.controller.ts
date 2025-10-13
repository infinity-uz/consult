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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'function for doctor',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Error during registration',
    schema: {
      example: {
        statusCode: 409,
        error: {
          message: 'Phone number already exists',
        },
      },
    },
  })
  @AccessRoles('public')
  @Post('register')
  register(@Body() dto: RegisterDoctorDto) {
    return this.doctorService.registerDoctor(dto);
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
  newToken(@CookieGetter('doctorToken') token: string) {
    return this.authService.newToken('doctor', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out doctor' })
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
    description: 'Failed sign out doctor',
    schema: {
      example: {
        statusCode: 401,
        error: {
          message: 'Refresh token not found',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All doctors get successfully with pagination',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error on get doctors',
    schema: {
      example: {
        statusCode: 500,
        error: {
          message: 'Internal server error',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All doctors get successfully ',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Failed get doctors',
    schema: {
      example: {
        statusCode: 403,
        error: {
          message: 'Forbidden user',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get doctor by id successfully ',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Failed get doctor by id',
    schema: {
      example: {
        statusCode: 403,
        error: {
          message: 'Forbidden user',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findbyId(@Param('id') id: number) {
    return this.doctorService.findOneById(id);
  }

  // ------------------- UPDATE -------------------
  @ApiOperation({ summary: 'Updating doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updating doctor',
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
    description: 'Failed updating doctor',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Not found',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.updateDoctor(+id, dto);
  }

  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete and activate doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft delete and active doctor',
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
    description: 'Failed soft delete and active doctor',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Not found',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, Roles.ADMIN)
  @Patch('softDelete:id')
  @ApiBearerAuth()
  softDelete(@Param('id') id: number, @Body() dto: softDeleteDto) {
    return this.doctorService.softDelete(id, dto);
  }

  // ------------------- DELETE -------------------
  @ApiOperation({ summary: 'Delete doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete doctor',
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
    description: 'Failed delete doctor',
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
    return this.doctorService.delete(id);
  }
}
