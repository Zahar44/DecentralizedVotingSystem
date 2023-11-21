import { MetadataApi } from "@app/core/client";
import { Controller } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RpcException } from "@nestjs/microservices";
import { RpcExceptionMessages } from "@app/core/exceptions/rpc";

@Controller()
@MetadataApi.MetadataImageControllerMethods()
export class ImageController implements MetadataApi.MetadataImageController {
    constructor(
        private readonly prisma: PrismaService,
    ) {}
    
    public async findOne({ tokenId, token }: MetadataApi.FindOneImageRequest): Promise<MetadataApi.FindOneImageResponse> {
        const res = await this.prisma.metadata.findFirst({
            select: {
                image: true,
            },
            where: {
                tokenId,
                collection: {
                    address: token,
                },
            },
        });
        if (!res) throw new RpcException(RpcExceptionMessages[404].NotFound);

        return {
            image: res.image,
        };
    }
}