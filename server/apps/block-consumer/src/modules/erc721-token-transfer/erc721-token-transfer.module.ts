import { Module } from "@nestjs/common";
import { ERC721TokenTransferService } from "./erc721-token-transfer.service";

@Module({
    providers: [ERC721TokenTransferService],
    exports: [ERC721TokenTransferService],
})
export class ERC721TokenTransferModule {}