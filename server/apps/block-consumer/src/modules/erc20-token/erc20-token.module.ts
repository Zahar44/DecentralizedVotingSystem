import { Module } from "@nestjs/common";
import { ERC20TokenService } from "./erc20-token.service";

@Module({
    providers: [ERC20TokenService],
    exports: [ERC20TokenService],
})
export class ERC20TokenModule {}