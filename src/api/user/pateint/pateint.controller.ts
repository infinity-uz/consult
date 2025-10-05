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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'function for patient',
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
  register(@Body() dto: RegisterPateintDto) {
    return this.pateintService.registerPAteint(dto);
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
  newToken(@CookieGetter('pateintToken') token: string) {
    return this.authService.newToken('pateints', token);
  }

  // ------------------- SIGNOUT -------------------
  @ApiOperation({ summary: 'Sign out pateint' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pateint sign out successfully',
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
    description: 'Failed sign out pateint',
    schema: {
      example: {
        statusCode: 401,
        error: {
          message: 'Refresh token not found',
        },
      },
    },
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All pateints get successfully with pagination',
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
    description: 'Error on get pateints',
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All pateints get successfully ',
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
    description: 'Failed get pateints',
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
    return this.pateintService.findAll({
      orderBy: { createdAt: 'desc' },
    });
  }

  // ----------------- FIND BY ID -----------------
  @ApiOperation({ summary: 'Get pateint by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get pateint by id successfully ',
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
    description: 'Failed get pateint by id',
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
    return this.pateintService.findOneById(id);
  }

  // ------------------- UPDATE -------------------
  @ApiOperation({ summary: 'Updating patient' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updating patient',
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
    description: 'Failed updating patient',
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
  update(@Param('id') id: number, @Body() dto: UpdatePateintDto) {
    return this.pateintService.updatePatient(+id, dto);
  }

  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete and activate patient' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft delete and active patient',
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
    description: 'Failed soft delete and active patient',
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
    return this.pateintService.softDelete(id, dto);
  }
}
