import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMetadataDto {
    @IsString()
    @MinLength(4)
    @MaxLength(50)
    name: string;
    @IsString()
    @MaxLength(500)
    description: string;
    @IsNumber()
    tokenId: number;
    @IsString()
    image: string;
}