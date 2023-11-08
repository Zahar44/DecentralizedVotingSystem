import { Body, Controller, Get, Inject, OnModuleInit, Param, Post } from "@nestjs/common";
import { AuthTag } from "./client-tag";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthApi } from "@app/core/client";

@Controller('auth')
export class AuthController implements OnModuleInit {
    private api: AuthApi.AuthClient;

    constructor(
        @Inject(AuthTag) private client: ClientGrpc,
    ) {}

    public onModuleInit() {
        this.api = this.client.getService<AuthApi.AuthClient>(AuthApi.AUTH_SERVICE_NAME);
    }

    @Get('message/:address')
    public async getMessage(@Param() params: any) {
        return this.api.requestValidation({ address: params.address });
    }

    @Post('message')
    public async setMessage(@Body() body: any) {
        return this.api.updateMessage({ value: body.message });
    }
}
