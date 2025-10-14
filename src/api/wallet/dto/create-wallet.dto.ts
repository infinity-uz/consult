import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateIf } from "class-validator";
import { CardType } from "generated/prisma";

const cardNumberRegex: RegExp = /^(?:(?:8600|9860)(?:[\s-]?\d){12}|4(?:[\s-]?\d){15}|5[1-5](?:[\s-]?\d){14}|(?:222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)(?:[\s-]?\d){12})$/;
const phoneNumberRegex: RegExp = /^\+998\d{9}$/;
const cardDateRegex: RegExp = /^(0[1-9]|1[0-2])\/\d{2}$/;
const cvvRegex: RegExp = /^\d{3,4}$/;

export class CreateWalletDto {
	@ApiProperty({
		type: 'string',
		description: 'Hamyonning nomi',
		example: 'Asosiy carta'
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		type: 'string',
		description: "Karta raqami 16 xonadan iborat va haqiqiy karta raqami bo'lishi kerak",
		example: '8600123456789012'
	})
	@Matches(cardNumberRegex, {
		message: "Karta raqami noto'g'ri formatda"
	})
	@IsNotEmpty()
	cardNumber: string;

	@ApiProperty({
		type: 'string',
		description: "Telefon raqami +998 bilan boshlanishi kerak",
		example: '+998991500136'
	})
	@Matches(phoneNumberRegex, {
		message: "Telefon raqami noto'gri formatda"
	})
	@IsNotEmpty()
	phoneNumber: string;

	@ApiProperty({
		type: 'string',
		description: 'Carta turini kiriting',
		example: 'HUMO',
		enum: CardType
	})
	@IsEnum(CardType, {
		message: "Karta turi faqat ko'rsatilganlar (UZCARD, HUMO, VISA, MASTERCARD) lardan biri bo'lishi kerak!"
	})
	@IsNotEmpty()
	type: CardType

	@ApiProperty({
		type: 'string',
		description: 'Kartaning amal qilish muddati',
		example: '08/15'
	})
	@Matches(cardDateRegex, {
		message: "kartaning amal qilish muddati noto'g'ri formatda"
	})
	@IsNotEmpty()
	date: string;

	@ApiProperty({
		type: 'number',
		description: 'kartaning cvv raqami (odatda 3 yoki 4 xonali raqam boladi)',
		required: false,
		example: 536
	})
	@ValidateIf(o => o.type === CardType.VISA || o.type === CardType.MASTERCARD)
	@Matches(cvvRegex, {
		message: "cvv raqami noto'g'ri formatda"
	})
	@IsInt()
	@IsOptional()
	cvv?: number;

	// @ApiProperty({
	// 	type: 'number',
	// 	description: 'Hamyon balansi',
	// 	example: 0,
	// })
	// @IsOptional()
	// @IsNumber()
	// balance?: number;

	// @ApiProperty({
	// 	type: 'number',
	// 	description: 'doctorning ID si',
	// 	example: 1
	// })
	// @IsOptional()
	// @IsInt()
	// doctorId?: number;

	// @ApiProperty({
	// 	type: 'number',
	// 	description: 'bemorning ID si',
	// 	example: 1
	// })
	// @IsOptional()
	// @IsInt()
	// pateintsId?: number;
}
