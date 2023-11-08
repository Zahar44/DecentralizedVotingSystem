import { Module } from '@nestjs/common';
import { BalanceModule } from './balance/balance.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [BalanceModule, AuthModule],
})
export class AppModule {}
