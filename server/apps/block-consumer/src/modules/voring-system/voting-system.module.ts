import { Module } from "@nestjs/common";
import { VotingSystemController } from "./voting-system.controller";
import { VotingSystemService } from "./voting-system.service";
import { ClientsModule } from "@nestjs/microservices";
import { MetadataTag } from "../../tags";
import { RpcErrorSerializer } from "@app/core/client/rpc-error-serializer";
import { MetadataApi } from "@app/core/client";
import { join } from "path";

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
    controllers: [VotingSystemController],
    providers: [VotingSystemService],
})
export class VotingSystemModule {}