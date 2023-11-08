import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthTag } from "./client-tag";
import { AuthApi } from "@app/core/client";
import { join } from "path";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: AuthTag,
                transport: Transport.GRPC,
                options: {
                    package: AuthApi.protobufPackage,
                    protoPath: join(__dirname, '../auth-api.proto'),
                },
            },
        ]),
    ],
    controllers: [AuthController],
})
export class AuthModule {}