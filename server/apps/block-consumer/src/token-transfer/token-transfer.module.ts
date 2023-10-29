import { Module } from "@nestjs/common";
import { TokenTransferService } from "./token-transfer.service";

@Module({
    providers: [TokenTransferService],
})
export class TokenTransferModule {}