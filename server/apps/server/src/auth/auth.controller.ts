import { BadRequestException, Body, Controller, Get, Inject, OnModuleInit, Param, Post, HttpCode, HttpStatus, Req } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { AuthApi } from "@app/core/client";
import { Observable } from "rxjs";
import { MessageRequestDto, MessageResponseDto, LoginRequestDto, LoginResponseDto, RefreshResponseDto, SetMessageRequestDto } from "./dto";
import { Request } from 'express';
import { AuthTag } from "../tags";

@Controller('auth')
export class AuthController implements OnModuleInit {
    private api: AuthApi.AuthClient;

    constructor(
        @Inject(AuthTag) private readonly client: ClientGrpc,
    ) {}

    public onModuleInit() {
        this.api = this.client.getService<AuthApi.AuthClient>(AuthApi.AUTH_SERVICE_NAME);
    }

    @Get('message/:address')
    public getMessage(@Param() params: MessageRequestDto): Observable<MessageResponseDto> {
        return this.api.requestValidation(params);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body() body: LoginRequestDto): Observable<LoginResponseDto> {
        return this.api.login(body);
    }

    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    public refresh(@Req() req: Request): Observable<RefreshResponseDto> {
        const token = req.headers.authorization;
        if (!token) throw new BadRequestException('Token is not valid');
        return this.api.refresh({ refreshToken: token });
    }

    @Post('message')
    @HttpCode(HttpStatus.OK)
    public setMessage(@Body() body: SetMessageRequestDto) {
        return this.api.updateMessage({ value: body.message });
    }
}
