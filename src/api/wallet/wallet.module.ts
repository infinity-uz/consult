import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletCron } from './wallet.cron';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [ScheduleModule.forRoot()],
	controllers: [WalletController],
	providers: [WalletService, WalletCron],
	exports: [WalletService]
})
export class WalletModule { }
