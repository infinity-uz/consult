import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetRequestUser } from 'src/common/decorator/get-request-user.decorator';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import {
  SwaggerRelatedToCancelPayment,
  SwaggerRelatedToCreate,
  SwaggerRelatedToDeletePayment,
  SwaggerRelatedToFindAll,
  SwaggerRelatedToFindOne,
  SwaggerRelatedToGetPaymentsByPatient,
} from 'src/common/swagger/payment.swagger';
import type { IToken } from 'src/infrastructure/token/interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @SwaggerRelatedToCreate()
  @AccessRoles(Roles.PATEINTS)
  @Post(':id')
  @ApiBearerAuth()
  createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Param('id') id: string,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.paymentService.createPayment(+id, user, createPaymentDto);
  }

  @SwaggerRelatedToFindAll()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Get('all')
  @ApiBearerAuth()
  getAllPayment() {
    return this.paymentService.findAll();
  }

  @SwaggerRelatedToFindOne()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATEINTS)
  @Get(':id')
  @ApiBearerAuth()
  getPaymentById(
    @Param('id') id: string,
    @GetRequestUser('user') user: IToken,
  ) {
    return this.paymentService.findOne(+id, user);
  }

  @SwaggerRelatedToGetPaymentsByPatient()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, 'ID')
  @Get(':id/user')
  @ApiBearerAuth()
  getPaymentsByPatient(@Param('id') id: string) {
    return this.paymentService.getPaymentsByPatient(+id);
  }

  @SwaggerRelatedToCancelPayment()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN, Roles.PATEINTS)
  @Patch(':id/cancel')
  @ApiBearerAuth()
  cancelPayment(@Param('id') id: string, @GetRequestUser('user') user: IToken) {
    return this.paymentService.cancelPayment(+id, user);
  }

  @SwaggerRelatedToDeletePayment()
  @AccessRoles(Roles.ADMIN, Roles.SUPERADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.paymentService.deletePayment(+id);
  }
}
