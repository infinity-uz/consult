import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WalletService } from './wallet.service';

@Injectable()
export class WalletCron {
	constructor(private readonly walletService: WalletService) { }

	@Cron(CronExpression.EVERY_DAY_AT_2AM)
	async handleDeleteOldWallets() {
		console.log("1 oydan eski hamyonlarni o'chirish boshlandi");
		await this.walletService.permanentlyDeleteOldWallets();
	}
}