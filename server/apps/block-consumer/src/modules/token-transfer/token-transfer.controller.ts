import { Topics } from "@app/core/web3";
import { Controller, Logger } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3";
import { ERC20TokenTransferService } from "../erc20-token-transfer/erc20-token-transfer.service";
import { ERC721TokenTransferService } from "../erc721-token-transfer/erc721-token-transfer.service";
@Controller()
export class TokenTransferController {
    private readonly logger = new Logger(TokenTransferController.name);

    constructor(
        private readonly erc20: ERC20TokenTransferService,
        private readonly erc721: ERC721TokenTransferService,
    ) {}

    @EventPattern(Topics.Transfer)
    public async consume(@Payload() data: string) {
        const parsed = JSON.parse(data) as Log;

        if (parsed.topics?.length || 0 > 3) {
            this.logger.debug(`About to handle erc721 transfer`);
            return this.erc721.handleLog(parsed);
        }

        this.logger.debug(`About to handle erc20 transfer`);
        return this.erc20.handleLog(parsed);
    }
}
