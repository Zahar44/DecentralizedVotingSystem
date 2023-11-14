import { Module } from "@nestjs/common";
import { BalanceERC20Service } from "./balance-erc20.controller";

@Module({
    controllers: [BalanceERC20Service],
})
export class BalanceERC20Module {}