import { Module } from "@nestjs/common";
import { MetadataModule } from "./metadata/metadata.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
    imports: [
        MetadataModule,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}