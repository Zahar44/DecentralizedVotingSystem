import { Module } from "@nestjs/common";
import { TokenTransferModule } from "./token-transfer/token-transfer.module";
import { BlockModule } from "./block/block.module";

@Module({
    imports: [BlockModule],
})
export class AppModule {}