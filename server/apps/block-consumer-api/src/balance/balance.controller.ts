import { BlockConsumerApi } from "@app/core/client";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { Controller, NotFoundException } from "@nestjs/common";
import { PrismaService } from "apps/block-consumer/src/modules/prisma/prisma.service";

@Controller()
@BlockConsumerApi.BalanceServiceControllerMethods()
export class BalanceService {
    constructor(private readonly prisma: PrismaService) {}

    public async findOne(
        data: BlockConsumerApi.BalanceByAddress,
        metadata: Metadata,
        call: ServerUnaryCall<any, any>,
    ): Promise<BlockConsumerApi.Balance> {
        const res = await this.prisma.balance.findFirst({
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
        if (!res) throw new NotFoundException();

        return {
            value: res.value,
        };
    }
}
