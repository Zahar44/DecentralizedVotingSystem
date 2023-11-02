import { Module } from "@nestjs/common";
import { BalanceModule } from "./balance/balance.module";
import { PrismaModule } from "apps/block-consumer/src/modules/prisma/prisma.module";

@Module({
    imports: [
        BalanceModule,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}