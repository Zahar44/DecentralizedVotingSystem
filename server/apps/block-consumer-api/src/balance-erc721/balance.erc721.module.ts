import { Module } from "@nestjs/common";
import { BalanceERC721Service } from "./balance-erc721.controller";

@Module({
    controllers: [BalanceERC721Service],
})
export class BalanceERC721Module {}