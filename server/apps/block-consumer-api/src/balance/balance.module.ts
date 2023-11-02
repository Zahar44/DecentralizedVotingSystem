import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.controller";

@Module({
    controllers: [BalanceService],
})
export class BalanceModule {}