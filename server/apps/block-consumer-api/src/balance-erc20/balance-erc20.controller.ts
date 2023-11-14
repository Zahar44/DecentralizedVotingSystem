import { BlockConsumerApi } from "@app/core/client";
import { RpcExceptionMessages } from "@app/core/exceptions/rpc";
import { Controller, HttpStatus, NotFoundException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { PrismaService } from "apps/block-consumer/src/modules/prisma/prisma.service";

@Controller()
@BlockConsumerApi.BalanceERC20ControllerMethods()
export class BalanceERC20Service implements BlockConsumerApi.BalanceERC20Controller {
    constructor(private readonly prisma: PrismaService) {}

    public async findOne(
        data: BlockConsumerApi.BalanceByAddress,
    ): Promise<BlockConsumerApi.BalanceERC20Response> {
        const res = await this.prisma.balanceERC20.findFirst({
            select: {
                value: true,
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
            value: res.value,
        };
    }
}
