import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { Web3ConfigLoaded, Web3ConnectionModule } from "@app/core/web3";
import { TokenTransferModule } from "./modules/token-transfer/token-transfer.module";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
            load: [Web3ConfigLoaded],
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