import { Topics } from "@app/core/web3";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3";
import { TokenTransferService } from "./token-transfer.service";

@Controller()
export class TokenTransferController {
    constructor(
        private readonly service: TokenTransferService,
    ) {}

    @EventPattern(Topics.ERC20.Transfer)
    public async consume(@Payload() data: string) {
        const parsed = JSON.parse(data) as Log;
        await this.service.handleLog(parsed);
    }
}
