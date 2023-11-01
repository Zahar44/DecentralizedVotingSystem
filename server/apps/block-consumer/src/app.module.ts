import { Module } from "@nestjs/common";
import { TokenTransferModule } from "./modules/token-transfer/token-transfer.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { Web3ConfigLoaded, Web3ConnectionModule } from "@app/core/web3";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [Web3ConfigLoaded]
        }),
        Web3ConnectionModule.registerFromConfig(true),
        TokenTransferModule,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}