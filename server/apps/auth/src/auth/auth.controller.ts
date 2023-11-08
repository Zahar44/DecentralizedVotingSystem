import { AuthApi } from "@app/core/client";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Controller, Inject, InternalServerErrorException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Cache } from "cache-manager";
import { randomUUID } from "crypto";

@Controller()
@AuthApi.AuthControllerMethods()
export class AuthController implements AuthApi.AuthController {
    private readonly messageKey = 'auth-message';

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
    ) {}
    
    public async updateMessage(
        { value }: AuthApi.UpdateMessageRequest,
    ): Promise<AuthApi.UpdateMessageResponse> {
        await this.cache.set(this.messageKey, value);
        return {};
    }

    public async requestValidation(
        { address }: AuthApi.RequestValidationRequest,
    ): Promise<AuthApi.RequestValidationResponse> {
        const message = await this.cache.get<string>(this.messageKey);
        if (!message) throw new RpcException(new InternalServerErrorException('Message is empty'));

        return {
            message: message + randomUUID(),
        };
    }

    public async validate(
        { address, signarute }: AuthApi.ValidateRequest,
    ): Promise<AuthApi.ValidateResponse> {
        return {
            valid: true,
        };
    }
}
