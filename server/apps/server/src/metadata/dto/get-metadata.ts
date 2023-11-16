import { Transform } from "class-transformer";
import { IsEthereumAddress, IsNumber } from "class-validator";
import Web3 from "web3";

export class GetMetadata {
    @IsNumber()
    tokenId: number;
}
