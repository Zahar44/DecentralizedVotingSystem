import { Module } from "@nestjs/common";
import { MetadataController } from "./metadata.controller";
import { ClientsModule } from "@nestjs/microservices";
import { RpcErrorSerializer } from "@app/core/client/rpc-error-serializer";
import { MetadataApi } from "@app/core/client";
import { join } from "path";
import { MetadataTag } from "../tags";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: MetadataTag,
                useFactory() {
                    return {
                        customClass: RpcErrorSerializer,
                        options: {
                            package: MetadataApi.protobufPackage,
                            protoPath: join(__dirname, '../metadata.proto'),
                            url: 'host.docker.internal:' + process.env.METADATA_PORT,
                        },
                    }
                }
            },
        ]),
    ],
    controllers: [MetadataController],
})
export class MetadataModule {}