import { AuthPayload } from "@app/core/auth";
import { AuthApi } from "@app/core/client";
import { RpcExceptionMessages } from "@app/core/exceptions/rpc";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Controller, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { Cache } from "cache-manager";
import { randomUUID } from "crypto";
import { recover } from "web3-eth-accounts";

@Controller()
@AuthApi.AuthControllerMethods()
export class AuthController implements AuthApi.AuthController {
    private readonly messageKey = 'auth-message';

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly jwtService: JwtService,
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
        if (!message) throw new RpcException(RpcExceptionMessages[500].InternalServerError);

        const nonce = randomUUID();
        await this.cache.set('rv' + address, nonce);

        return {
            message: message + nonce,
        };
    }

    public async login(
        { address, signature }: AuthApi.LoginRequest,
    ): Promise<AuthApi.LoginResponse> {
        const nonce = await this.cache.get<string>('rv' + address);
        const message = await this.cache.get<string>(this.messageKey);
        if (!nonce) throw new RpcException(RpcExceptionMessages[404].NotFound);

        const signedMessage = message + nonce;
        const recoveredAddress = recover(signedMessage, signature);

        if (recoveredAddress !== address) throw new RpcException(RpcExceptionMessages[401].SignatureIsNotCorrect);

        const payload: AuthPayload = { address };
        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: 60 });
        const refreshToken = await this.jwtService.signAsync({}, { expiresIn: 600 });

        await this.cache.set(refreshToken, payload);
        await this.cache.del('rv' + address);

        return {
            accessToken,
            refreshToken,
        };
    }

    public async refresh(
        { refreshToken }: AuthApi.RefreshRequest
    ): Promise<AuthApi.RefreshResponse> {
        const payload = await this.cache.get(refreshToken);
        if (!payload) throw new RpcException(RpcExceptionMessages[401].SignatureIsNotCorrect);

        const accessToken = await this.jwtService.signAsync(payload, { expiresIn: 60 });
        return {
            accessToken,
        };
    }

    public async logout(
        request: AuthApi.LogoutRequest
    ): Promise<AuthApi.LogoutResponse> {
        await this.cache.del(request.token);
        return {};
    }
}
