import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';

@Module({
    imports: [BalanceModule],
})
export class AppModule {}
