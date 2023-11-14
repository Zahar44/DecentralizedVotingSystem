import { Transform } from "class-transformer";
import { IsEthereumAddress, IsString } from "class-validator";
import Web3 from "web3";

export class LoginRequestDto {
    @IsString()
    signature: string;
    @IsEthereumAddress()
    @Transform(({ value }) => Web3.utils.toChecksumAddress(value))
    address: string;
}

export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
};
