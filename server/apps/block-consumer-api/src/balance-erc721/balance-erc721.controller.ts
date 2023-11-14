import { BlockConsumerApi } from "@app/core/client";
import { RpcExceptionMessages } from "@app/core/exceptions/rpc";
import { Controller, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { PrismaService } from "apps/block-consumer/src/modules/prisma/prisma.service";

@Controller()
@BlockConsumerApi.BalanceERC721ControllerMethods()
export class BalanceERC721Service implements BlockConsumerApi.BalanceERC721Controller {
    constructor(private readonly prisma: PrismaService) {}

    public async findOne(
        data: BlockConsumerApi.BalanceByAddress,
    ): Promise<BlockConsumerApi.BalanceERC721Response> {
        const res = await this.prisma.balanceERC721.findFirst({
            select: {
                values: true,
            },
            where: {
                account: {
                    address: data.account,
                },
                token: {
                    address: data.token,
                },
            },
        });

        if (!res) throw new RpcException(RpcExceptionMessages[HttpStatus.NOT_FOUND].NotFound);

        return {
            values: res.values,
        };
    }
}
