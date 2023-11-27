import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { Web3ConfigLoaded, Web3ConnectionModule } from "@app/core/web3";
import { TokenTransferModule } from "./modules/token-transfer/token-transfer.module";
import { join } from "path";
import { VotingSystemModule } from "./modules/voring-system/voting-system.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
            load: [Web3ConfigLoaded],
        }),
        Web3ConnectionModule.registerFromConfig(true),
        TokenTransferModule,
        VotingSystemModule,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}