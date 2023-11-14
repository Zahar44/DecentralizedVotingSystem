import { Module } from "@nestjs/common";
import { BalanceERC20Module } from "./balance-erc20/balance-erc20.module";
import { PrismaModule } from "apps/block-consumer/src/modules/prisma/prisma.module";
import { BalanceERC721Module } from "./balance-erc721/balance.erc721.module";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
        }),
        BalanceERC20Module,
        BalanceERC721Module,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}