import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetMetadataRequestDto {
    @IsNumber()
    @Type(() => Number)
    tokenId: number;
}

export interface GetMetadataResponseDto {
    name: string;
    description: string;
    image: string;
    tokenId: number;
    attributes?: MetadataAttribute[];
}

export interface MetadataAttribute {
    trait_type?: string;
    value?: string;
    display_type?: string;
}
