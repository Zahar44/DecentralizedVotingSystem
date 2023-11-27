import { Type } from "class-transformer";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMetadataDto {
    @IsNumber()
    @Type(() => Number)
    tokenId: number;
}