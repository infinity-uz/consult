import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentType } from 'generated/prisma';

export class CreatePaymentDto {
  @ApiPropertyOptional({
    enum: PaymentType,
    default: PaymentType.CARD,
    description: 'To‘lov turi (CARD, CASH, TRANSFER ...)',
  })
  @IsEnum(PaymentType)
  @IsOptional()
  paymentType: PaymentType;

  @ApiProperty({ description: 'Uchrashuv sanasi (format: YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  meetingDate: string;

  @ApiProperty({ description: 'To‘lov tavsifi yoki eslatma' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: "Qaysi kartadan to'lamoqchi" })
  @IsString()
  @IsOptional()
  walletId?: number;
}
