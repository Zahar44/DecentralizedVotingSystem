import { Module } from "@nestjs/common";
import { BalanceController } from "./balance.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { BlockConsumerApi } from "@app/core/client";
import { BlockConsumerTag } from "./client-tag";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: BlockConsumerTag,
                transport: Transport.GRPC,
                options: {
                    package: BlockConsumerApi.protobufPackage,
                    protoPath: join(__dirname, '../block-consumer-api.proto'),
                },
            },
        ]),
    ],
    controllers: [BalanceController],
})
export class BalanceModule { }