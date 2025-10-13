import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { BaseService } from 'src/infrastructure/base/base.service';
import { CardType, Role, type Doctor, type Pateints, type Wallet } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma.service';
import { CryptoService } from 'src/infrastructure/crypto/Crypto';
import { TokenService } from 'src/infrastructure/token/Token';
import { ISuccess } from 'src/infrastructure/response/success.interface';
import { IToken } from 'src/infrastructure/token/interface';
import { Roles } from 'src/common/enum/Roles.enum';
import { successRes } from 'src/infrastructure/response/success';

@Injectable()
export class WalletService extends BaseService
<
	CreateWalletDto, UpdateWalletDto, Wallet
> {

	constructor(
		protected readonly prisma: PrismaService,
	) {
		super(prisma, prisma.wallet)
	}

	async createWallet(createWalletDto: CreateWalletDto, user: IToken): Promise<ISuccess> {
		const {
			name,
			cardNumber,
			phoneNumber,
			date,
			type,
			cvv,
		} = createWalletDto;

		if (user.role !== Roles.DOCTOR && user.role !== Roles.PATEINTS) {
			throw new ForbiddenException('Faqat doctor yoki patient wallet yarata oladi');
		}

		let userEntity: any;
		if (user.role === Roles.DOCTOR) {
			userEntity = await this.prisma.doctor.findUnique({ where: { id: user.id } });
			if (!userEntity) {
				throw new NotFoundException('Doctor not found');
			}
		} else if (user.role === Roles.PATEINTS) {
			userEntity = await this.prisma.pateints.findUnique({ where: { id: user.id } });
			if (!userEntity) {
				throw new NotFoundException('Pateint not found');
			}
		}

		const existsCardNumber = await this.prisma.wallet.findUnique({ where: { cardNumber } });
		if (existsCardNumber) {
			throw new BadRequestException('this Card number is already exists');
		}
		const existsPhoneNumber = await this.prisma.wallet.findUnique({ where: { phoneNumber } });
		if (existsPhoneNumber) {
			throw new BadRequestException('this Phone number is already exists');
		}

		const cardReqiuresCvv = ([CardType.VISA, CardType.MASTERCARD] as CardType[]).includes(type);

		if (cardReqiuresCvv) {
			if (!cvv) {
				throw new BadRequestException('VISA yoki MASTERCARD uchun CVV kiritish majburiy');
			}
			if (!/^\d{3,4}$/.test(String(cvv))) {
				throw new BadRequestException('CVV 3 yoki 4 xonali raqam bolishi kerak');
			}
		} else {
			if (cvv) {
				throw new BadRequestException('UZCARD yoki HUMO kartalari uchun CVV kiritish shart emas');
			}
		}

		const walletData: any = {
			name,
			cardNumber,
			phoneNumber,
			type,
			date,
			balance: 0,
		};

		if (cardReqiuresCvv && cvv) {
			walletData.cvv = cvv;
		}

		if (user.role === Roles.DOCTOR) {
			walletData.doctor = { connect: { id: user.id } };
		} else if (user.role === Roles.PATEINTS) {
			walletData.pateints = { connect: { id: user.id } };
		}

		const newWallet = await this.prisma.wallet.create({
			data: walletData
		});

		return successRes(newWallet, 201);
	}

	async findAllWallet(user: IToken): Promise<ISuccess> {
		if (
			user.role !== Roles.DOCTOR &&
			user.role !== Roles.PATEINTS &&
			user.role !== Roles.SUPERADMIN
		) {
			throw new ForbiddenException('Forbidden user');
		}

		const wallets = await this.prisma.wallet.findMany({
			where: {
				isDeleted: false,
				...(user.role === Roles.DOCTOR
					? { doctorId: user.id }
					: user.role === Roles.PATEINTS
						? { pateintsId: user.id }
						: {}
				)
			}
		});
		return successRes(wallets);
	}

	async findOneWallet(id: number, user: IToken): Promise<ISuccess> {
		const wallet = await this.prisma.wallet.findUnique({ where: { id } });
		if (!wallet || wallet.isDeleted) {
			throw new NotFoundException('Wallet not found');
		}

		if (
			user.role === Roles.DOCTOR && wallet.doctorId !== user.id ||
			user.role === Roles.PATEINTS && wallet.pateintsId !== user.id
		) {
			throw new ForbiddenException("Siz bu walletni ko'ra olmaysiz");
		}

		if (
			user.role !== Roles.DOCTOR &&
			user.role !== Roles.PATEINTS &&
			user.role !== Roles.SUPERADMIN
		) {
			throw new ForbiddenException("Siz bu walletni ko'ra olmaysiz");
		}

		return successRes(wallet);
	}
	  

	async updateWallet(id: number, updateWalletDto: UpdateWalletDto, user: IToken): Promise<ISuccess> {
		const wallet = await this.prisma.wallet.findUnique({ where: { id } });
		if (!wallet) throw new NotFoundException('Wallet not foud');
		if (
			(user.role === Roles.DOCTOR && wallet?.doctorId !== user.id) ||
			(user.role === Roles.PATEINTS && wallet?.pateintsId !== user.id) ||
			(user.role !== Roles.DOCTOR && user.role !== Roles.PATEINTS)
		) {
			throw new ForbiddenException('Siz walletni update qila olmaysiz');
		}

		const { cardNumber, phoneNumber } = updateWalletDto;

		if (cardNumber) {
			const existsCard = await this.prisma.wallet.findUnique({ where: { cardNumber } });
			if (existsCard && existsCard.id !== id) {
				throw new ConflictException('Card number is already exists');
			}
		}
		if (phoneNumber) {
			const existsPhone = await this.prisma.wallet.findUnique({ where: { phoneNumber } });
			if (existsPhone && existsPhone.id !== id) {
				throw new ConflictException('Phone number is already exists');
			}
		}

		const updatedWAllet = await this.prisma.wallet.update({
			data: updateWalletDto,
			where: { id },
		});
		return successRes(updatedWAllet);
	}

	async removeWallet(id: number, user: IToken): Promise<ISuccess> {
		const wallet = await this.prisma.wallet.findUnique({ where: { id, isDeleted: false } });
		if (!wallet) throw new NotFoundException('Wallet not found');
		if (
			(user.role === Roles.DOCTOR && wallet?.doctorId !== user.id) ||
			(user.role === Roles.PATEINTS && wallet?.pateintsId !== user.id) ||
			(user.role !== Roles.DOCTOR && user.role !== Roles.PATEINTS)
		) {
			throw new ForbiddenException("Sizda walletni o'chirishga huquq yo'q");
		}

		await this.prisma.wallet.update({
			where: { id },
			data: {
				isDeleted: true,
				timeDeleted: new Date()
			}
		});

		return successRes({});
	}

	async permanentlyDeleteOldWallets(): Promise<void> {
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		const result = await this.prisma.wallet.deleteMany({
			where: {
				isDeleted: true,
				timeDeleted: {
					lte: oneMonthAgo
				}
			}
		});

		console.log(`${result.count} ta wallet butunlay o'chirildi`);
	}
}
