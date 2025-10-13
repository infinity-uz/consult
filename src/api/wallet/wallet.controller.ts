import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { successRes } from 'src/infrastructure/response/success';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from 'src/common/decorator/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
import type { IToken } from 'src/infrastructure/token/interface';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
	constructor(private readonly walletService: WalletService) { }

//	============================= Create Wallet =============================== //

	@ApiOperation({
		summary: 'Create Wallet'
	})
	@ApiBody({ type: CreateWalletDto })
	@ApiResponse({
		status: 201,
		description: "Wallet muvaffaqiyatli yaratildi",
		schema: {
			example: {
				success: true,
				statusCode: 201,
				data: {
					id: 1,
					name: "Asosiy wallet",
					cardNumber: "8600123456789012",
					phoneNumber: "+998901234567",
					type: "UZCARD",
					date: "12/25",
					balance: 0,
					isDeleted: false,
					doctorId: 1,
					pateintsId: null
				}
			},
		},
	})
	@UseGuards(AuthGuard, RolesGuard)
	@AccessRoles(Roles.DOCTOR, Roles.PATEINTS)
	@Post()
	@ApiBearerAuth()
	create(
		@Body() createWalletDto: CreateWalletDto,
		@CurrentUser() user: IToken
	) {
		return this.walletService.createWallet(createWalletDto, user);
	}

	//	============================= Get All Wallets =============================== //

	@ApiOperation({
		summary: 'get all wallets'
	})
	@ApiResponse({
		status: 200,
		description: "Hama hamyonlar royxati",
		schema: {
			example: {
				success: true,
				statusCode: 200,
				data: [
					{
						id: 1,
						name: "Asosiy wallet",
						cardNumber: "8600123456789012",
						phoneNumber: "+998901234567",
						type: "UZCARD",
						date: "12/25",
						balance: 0,
						isDeleted: false,
						doctorId: 1,
						pateintsId: null
					}
				]
			},
		},
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@AccessRoles(Roles.DOCTOR, Roles.PATEINTS, Roles.SUPERADMIN)
	@Get()
	findAll(@CurrentUser() user: IToken) {
		return this.walletService.findAllWallet(user);
	}

	//	============================= Get Wallet By Id =============================== //

	@ApiOperation({
		summary: 'get wallet by id'
	})
	@ApiResponse({
		status: 200,
		description: "hamyon",
		schema: {
			example: {
				success: true,
				statusCode: 200,
				data: {
					id: 1,
					name: "Asosiy wallet",
					cardNumber: "8600123456789012",
					phoneNumber: "+998901234567",
					type: "UZCARD",
					date: "12/25",
					balance: 0,
					isDeleted: false,
					doctorId: 1,
					pateintsId: null
				}
			},
		},
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@AccessRoles(Roles.DOCTOR, Roles.PATEINTS, Roles.SUPERADMIN)
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: IToken) {
		return this.walletService.findOneWallet(id, user);
	}

	//	============================= Update Wallet =============================== //

	@ApiOperation({
		summary: 'Update Wallet'
	})
	@ApiBody({ type: UpdateWalletDto })
	@ApiResponse({
		status: 200,
		description: "Wallet muvaffaqiyatli yangilandi",
		schema: {
			example: {
				success: true,
				statusCode: 200,
				data: {
					id: 1,
					name: "Asosiy wallet",
					cardNumber: "8600123456789012",
					phoneNumber: "+998901234567",
					type: "UZCARD",
					date: "12/25",
					balance: 0,
					isDeleted: false,
					doctorId: 1,
					pateintsId: null
				}
			},
		},
	})
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@AccessRoles(Roles.DOCTOR, Roles.PATEINTS)
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number,
		@Body() updateWalletDto: UpdateWalletDto,
		@CurrentUser() user: IToken
	) {
		return this.walletService.updateWallet(id, updateWalletDto, user);
	}


	//	============================= Delete Wallet =============================== //

	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@AccessRoles(Roles.DOCTOR, Roles.PATEINTS)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number,
		@CurrentUser() user: IToken
	) {
		return this.walletService.removeWallet(id, user);
	}
}
