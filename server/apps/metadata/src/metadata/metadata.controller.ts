import { BlockConsumerApi, MetadataApi } from "@app/core/client";
import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BlockConsumerTag } from "../tags";
import { ClientGrpc, RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { RpcExceptionMessages } from "@app/core/exceptions/rpc";

@Controller()
@MetadataApi.MetadataControllerMethods()
export class MetadataController implements MetadataApi.MetadataController, OnModuleInit {
    private api: BlockConsumerApi.BalanceERC721Client;

    constructor(
        private readonly prisma: PrismaService,
        @Inject(BlockConsumerTag) private readonly client: ClientGrpc,
    ) {}

    public onModuleInit() {
        this.api = this.client.getService(BlockConsumerApi.BALANCE_ER_C721_SERVICE_NAME);
    }

    public async create(
        request: MetadataApi.CreateRequest,
    ): Promise<MetadataApi.CreateResponse> {
        await this.requireTokenOwner(request.account, request.token, request.tokenId);

        await this.prisma.metadata.create({
            data: {
                collection: {
                    connectOrCreate: {
                        create: {
                            address: request.token,
                        },
                        where: {
                            address: request.token,
                        }
                    }
                },
                tokenId: request.tokenId,
                name: request.name,
                description: request.description,
            }
        });

        return {};
    }

    public async setImage(
        request: MetadataApi.SetImageRequest
    ): Promise<MetadataApi.SetImageResponse> {
        await this.requireTokenOwner(request.account, request.token, request.tokenId);

        const metadata = await this.prisma.metadata.findFirst({
            select: {
                id: true,
            },
            where: {
                collection: {
                    address: request.token,
                },
                tokenId: request.tokenId,
            },
        });
        if (!metadata) throw new RpcException(RpcExceptionMessages[404].NotFound);

        await this.prisma.metadataImage.create({
            data: {
                metadataId: metadata.id,
                data: Buffer.from(request.image),
            }
        });

        return {};
    }

    private async requireTokenOwner(account: string, tokenAddress: string, tokenId: number) {
        const token = await firstValueFrom(this.api.findOne({
            account: account,
            token: tokenAddress,
        }));

        if (!token.values?.some((v) => v === tokenId))
            throw new RpcException(RpcExceptionMessages[401].NotAnOwner);
    }

    public async findAll(
        request: MetadataApi.FindAllRequest
    ): Promise<MetadataApi.FindAllResponse> {
        const res = await this.prisma.metadata.findMany({
            select: {
                tokenId: true,
                name: true,
                description: true,
            },
        });

        return {
            data: res,
        };
    }

    public async findOne(
        request: MetadataApi.FindOneRequest,
    ): Promise<MetadataApi.FindOneResponse> {
        const res = await this.prisma.metadata.findFirst({
            select: {
                tokenId: true,
                name: true,
                description: true,
            },
            where: {
                collection: {
                    address: request.token,
                },
                tokenId: request.tokenId,
            },
        });
        if (!res) throw new RpcException(RpcExceptionMessages[404].NotFound);

        return res;
    }
}
