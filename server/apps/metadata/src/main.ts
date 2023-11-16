import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { MetadataApi } from "@app/core/client";
import { join } from "path";

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: MetadataApi.protobufPackage,
            protoPath: join(__dirname, '../metadata.proto'),
            url: 'metadata:' + process.env.METADATA_PORT,
        },
    });

    await app.init();
    await app.startAllMicroservices();

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
