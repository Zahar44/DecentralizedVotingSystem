import { BlockConsumerApi } from "@app/core/client";
import { Controller, Get, Inject, OnModuleInit, Param } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { BlockConsumerTag } from "./client-tag";
import { GetBalanceDto } from "./dto/get-balance";
import { catchError } from "rxjs";
import { catchNotFound } from "@app/core/client/catch-not-found-error";

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
        return this.balanceService.findOne(param).pipe(catchError(catchNotFound));
    }
}
