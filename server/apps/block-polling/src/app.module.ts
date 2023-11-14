import { Web3ConfigLoaded, Web3ConnectionModule } from "@app/core/web3";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BlockPollingModule } from "./modules/block-polling/block-polling.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
            load: [Web3ConfigLoaded],
        }),
        Web3ConnectionModule.registerFromConfig(true),
        BlockPollingModule.register(),
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule { }