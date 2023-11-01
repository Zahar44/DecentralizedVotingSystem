import { Module } from "@nestjs/common";
import { TokenTransferController } from "./token-transfer.controller";
import { TokenTransferService } from "./token-transfer.service";
import { ERC20TokenModule } from "../erc20-token/erc20-token.module";

@Module({
    imports: [ERC20TokenModule],
    controllers: [TokenTransferController],
    providers: [TokenTransferService],
})
export class TokenTransferModule {}