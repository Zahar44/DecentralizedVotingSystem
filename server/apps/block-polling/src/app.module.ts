import { Web3ConfigLoaded, Web3ConnectionModule } from "@app/core/web3";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { BlockPollingModule } from "./modules/block-polling/block-polling.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QueueClient, QueueTypes } from "@app/core/queue";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [Web3ConfigLoaded]
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