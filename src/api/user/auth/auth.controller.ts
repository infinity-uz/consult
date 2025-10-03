import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmPhoneNumberDto } from 'src/common/dto/registerPhoneNumber-doctor.dto';
import { type Response } from 'express';
import { ConfirmOtpDto } from 'src/common/dto/confirmOtp.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------- SEND OTP -------------------
  @ApiOperation({ summary: 'Send otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Send otp for doctor and patient',
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
    description: 'Failed to sending otp',
    schema: {
      example: {
        statusCode: 404,
        error: {
          message: 'user not found',
        },
      },
    },
  })
  @Post('sendOtp')
  sendOTP(@Body() dto: ConfirmPhoneNumberDto) {
    return this.authService.sendOTP(dto);
  }

  // ----------------- CONFIRM OTP ------------------
  @ApiOperation({ summary: 'Confirm otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Confirm otp for doctor and patient',
    schema: {
      example: {
        statusCode: 200,
        message: 'success',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to confirm otp',
    schema: {
      example: {
        statusCode: 400,
        error: {
          message: 'otp expired or incorect',
        },
      },
    },
  })
  @Post('confirOTP')
  confirmOTP(@Body() dto: ConfirmOtpDto, res: Response) {
    return this.authService.confirmOtp(res, dto);
  }
}
