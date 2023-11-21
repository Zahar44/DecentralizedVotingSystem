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
        const token = await firstValueFrom(this.api.findOne({
            account: request.account,
            token: request.token,
        }));

        if (!token.values?.some((v) => v === request.tokenId))
            throw new RpcException(RpcExceptionMessages[401].NotAnOwner);

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
                title: request.name,
                type: 'object',
                image: Buffer.from(request.image),
            }
        });

        return {};
    }


    public async findAll(
        request: MetadataApi.FindAllRequest
    ): Promise<MetadataApi.FindAllResponse> {
        const res = await this.prisma.metadata.findMany({
            select: {
                tokenId: true,
                title: true,
                type: true,
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
                title: true,
                type: true,
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
