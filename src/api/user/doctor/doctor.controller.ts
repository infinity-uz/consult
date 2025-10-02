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
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ConfirmPhoneNumberDto } from 'src/common/dto/registerPhoneNumber-doctor.dto';
import { AuthService } from '../auth/auth.service';
import { ConfirmOtpDto } from 'src/common/dto/confirmOtp-doctor.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { CookieGetter } from 'src/common/decorator/cookie-getter.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { type Response } from 'express';
import { forGetOTPData } from 'src/common/document/forgetOTPData';
import { PaginationQueryDto } from 'src/common/dto/query-pagination.dto';
import { softDeleteDto } from 'src/common/dto/soft-delete.dto';
import { SignInDoctorDto } from './dto/signIn-doctor.dto';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import { type IToken } from 'src/infrastructure/token/interface';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly authService: AuthService,
  ) {}

  // -------------- FOR GET OTP ---------------
  @ApiOperation({
    summary: 'Send otp to phone number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP sending to phone number successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: forGetOTPData,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed sending otp to phone number',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'Phone number not fond',
        },
      },
    },
  })
  @AccessRoles()
  @Post('forGetOTP')
  forGerPassword(@Body() dto: ConfirmPhoneNumberDto) {
    return this.authService.sendOTP('doctor', dto);
  }

  // ---------------- CONFIRM OTP ----------------

  @ApiOperation({
    summary: 'Confirm otp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP confirmed successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {
          message: 'success',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed in confirmation otp',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'OTP incorect or expired',
        },
      },
    },
  })
  @AccessRoles(Roles.SUPERADMIN, 'ID')
  @Post('confirmOTP')
  confirmOTP(@Body() dto: ConfirmOtpDto) {
    return this.authService.confirmOtp('doctor', dto);
  }

  // ------------------- SIGNIN -------------------
  @ApiOperation({ summary: 'Sign in doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Doctor signed successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'success',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Failed signin doctor',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'No doctor found for this number',
        },
      },
    },
  })
  @AccessRoles('public')
  @Post('signin')
  signin(
    @Body() signInDto: SignInDoctorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.doctorService.signIn(signInDto, res);
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
  // @ApiBearerAuth()
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

  // @Post('registr')
  // create(@Body() createDoctorDto: CreateDoctorDto) {
  //   return this.doctorService.create(createDoctorDto);
  // }

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
  @AccessRoles(Roles.SUPERADMIN)
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
  @AccessRoles(Roles.SUPERADMIN)
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
  @AccessRoles(Roles.SUPERADMIN, 'ID')
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
    @AccessRoles(Roles.SUPERADMIN, 'ID')
    @Patch(':id')
    @ApiBearerAuth()
    update(
      @Param('id') id: number,
      @Body() dto: UpdateDoctorDto,
      @GetRequestUser('user') user: IToken,
    ) {
      console.log(id);
      return this.doctorService.updateDoctor(+id, dto, user);
    }


  // --------------- SOFT DELETE ------------------
  @ApiOperation({ summary: 'Soft delete doctor' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Soft delete doctor',
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
    description: 'Failed soft delete doctor',
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
