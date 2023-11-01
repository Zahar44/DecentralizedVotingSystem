import { Inject, Injectable, Logger } from "@nestjs/common";
import { QueueClient } from "@app/core/queue";
import { ClientProxy } from "@nestjs/microservices";
import { BlockType } from "apps/block-polling/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Log } from "web3";

@Injectable()
export class DispatchBlockService {
    private readonly logger = new Logger(DispatchBlockService.name);

    constructor(
        @Inject(QueueClient) private readonly queueClient: ClientProxy,
        private readonly prisma: PrismaService,
    ) {}

    public async dispatchLogs(logs: (string | Log)[]) {
        for (const log of logs) {
            if (typeof log === 'object' && log.topics && log.topics?.length > 0) {
                this.queueClient.emit(log.topics[0], JSON.stringify(log, (_, v) => typeof v === 'bigint' ? v.toString() : v));
            }
        }
    }

    public async setBlockProcessed(number: bigint) {
        await this.prisma.block.update({
            where: {
                type: BlockType.Latest,
            },
            data: {
                number,
            },
        });

        this.logger.debug(`Processed block ${number}`);
    }
}