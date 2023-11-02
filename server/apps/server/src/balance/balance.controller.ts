import { BlockConsumerApi } from "@app/core/client";
import { Controller, Get, Inject, OnModuleInit, Param } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { BlockConsumerTag } from "./client-tag";
import { GetBalanceDto } from "./dto/get-balance";

@Controller('balance')
export class BalanceController implements OnModuleInit {
    private balanceService: BlockConsumerApi.BalanceServiceClient;
    
    constructor(
        @Inject(BlockConsumerTag) private client: ClientGrpc,
    ) {}

    public onModuleInit() {
        this.balanceService = this.client.getService
            <BlockConsumerApi.BalanceServiceClient>(BlockConsumerApi.BALANCE_SERVICE_NAME);
    }

    @Get(':account/:token')
    public async getBalance(
        @Param() param: GetBalanceDto,
    ) {
        console.log(321);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(123);
        return;
        return this.balanceService.findOne(param);
    }
}
