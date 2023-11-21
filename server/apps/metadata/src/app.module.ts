import { Module } from "@nestjs/common";
import { MetadataModule } from "./metadata/metadata.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ImageModule } from "./image/image.module";

@Module({
    imports: [
        MetadataModule,
        ImageModule,
        {
            global: true,
            module: PrismaModule,
        },
    ],
})
export class AppModule {}