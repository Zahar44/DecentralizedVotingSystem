import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ClientsModule } from "@nestjs/microservices";
import { AuthApi } from "@app/core/client";
import { join } from "path";
import { RpcErrorSerializer } from "@app/core/client/rpc-error-serializer";
import { AuthTag } from "../tags";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: AuthTag,
                useFactory() {
                    return {
                        customClass: RpcErrorSerializer,
                        options: {
                            package: AuthApi.protobufPackage,
                            protoPath: join(__dirname, '../auth-api.proto'),
                            url: 'auth:' + process.env.AUTH_PORT,
                        },
                    }
                }
            },
        ]),
    ],
    controllers: [AuthController],
})
export class AuthModule {}