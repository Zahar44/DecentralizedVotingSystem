import { Module } from "@nestjs/common";
import { TokenTransferController } from "./token-transfer.controller";
import { ERC20TokenTransferModule } from "../erc20-token-transfer/erc20-token-transfer.module";
import { ERC721TokenTransferModule } from "../erc721-token-transfer/erc721-token-transfer.module";

@Module({
    imports: [ERC20TokenTransferModule, ERC721TokenTransferModule],
    controllers: [TokenTransferController],
})
export class TokenTransferModule {}