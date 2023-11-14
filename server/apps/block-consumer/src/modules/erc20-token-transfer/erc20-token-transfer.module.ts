import { Module } from "@nestjs/common";
import { ERC20TokenTransferService } from "./erc20-token-transfer.service";
import { ERC20TokenModule } from "../erc20-token/erc20-token.module";

@Module({
    imports: [ERC20TokenModule],
    providers: [ERC20TokenTransferService],
    exports: [ERC20TokenTransferService],
})
export class ERC20TokenTransferModule {}