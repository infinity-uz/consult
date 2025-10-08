import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response } from 'express';

import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerApi } from 'src/common/swagger/response.swagger';
import { ConfirmOtpDto } from './dto/confirmOtp.dto';
import { ConfirmPhoneNumberDto } from './dto/registerPhoneNumber-doctor.dto';
import { updatePhoneNumber } from './dto/updatePhoneNumber.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------- SEND OTP -------------------
  @ApiOperation({ summary: 'Send otp' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @ApiResponse(SwaggerApi.ApiErrorResponse('error in send otp'))
  @Post('sendOtp')
  sendOTP(@Body() dto: ConfirmPhoneNumberDto) {
    console.log('bbb');
    
    return this.authService.sendOTP(dto);
  }

  // ----------------- CONFIRM OTP ------------------
  @ApiOperation({ summary: 'Confirm otp' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @ApiResponse(SwaggerApi.ApiErrorResponse('error in confirm otp'))
  @Post('confirOTP')
  confirmOTP(
    @Body() dto: ConfirmOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.confirmOtp(res, dto);
  }
  
  // ----------------- UPDATE ------------------
  @ApiOperation({ summary: 'Confirm otp' })
  @ApiResponse(SwaggerApi.ApiSuccessResponse())
  @ApiResponse(SwaggerApi.ApiErrorResponse('error in confirm otp'))
  @UseGuards(AuthGuard, RolesGuard)
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, 'ID')
  @Patch('updatePhoneNumber:id')
  @ApiBearerAuth()
  updatePhoneNumber(@Param('id') id: number, @Body() dto: updatePhoneNumber) {
    return this.authService.updatePhoneNumber(id, dto);
  }
}
