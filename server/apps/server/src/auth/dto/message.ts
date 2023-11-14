import { AuthApi } from "@app/core/client";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import Web3 from "web3";

export class MessageRequestDto {
    @Transform(({ value }) => Web3.utils.toChecksumAddress(value))
    address: string;
}

export class SetMessageRequestDto {
    @IsString()
    message: string;
}


export type MessageResponseDto = AuthApi.RequestValidationResponse;