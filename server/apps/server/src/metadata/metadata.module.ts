import { Module } from "@nestjs/common";
import { MetadataService } from "./metadata.service";
import { MetadataController } from "./metadata.controller";
import { ClientsModule } from "@nestjs/microservices";
import { BlockConsumerTag } from '../tags';
import { RpcErrorSerializer } from "@app/core/client/rpc-error-serializer";
import { BlockConsumerApi } from "@app/core/client";
import { join } from "path";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: BlockConsumerTag,
                useFactory() {
                    return {
                        customClass: RpcErrorSerializer,
                        options: {
                            package: BlockConsumerApi.protobufPackage,
                            protoPath: join(__dirname, '../block-consumer-api.proto'),
                            url: 'blocks-consumer-api:' + process.env.BLOCK_CONSUMER_PORT,
                        },
                    }
                }
            },
        ]),
    ],
    controllers: [MetadataController],
    providers: [MetadataService],
})
export class MetadataModule {}