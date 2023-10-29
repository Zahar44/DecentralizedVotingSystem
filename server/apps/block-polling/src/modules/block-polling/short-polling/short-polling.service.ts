import { Web3Connection } from "@app/core/web3";
import { Inject, Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import Web3, { Block } from "web3";
import { IBlocksPollingService } from "../../../common/blocks-polling-service";
import { PrismaService } from "../../prisma/prisma.service";
import { BlockType } from "apps/block-polling/prisma/client";
import { QueueClient, QueuePatterns } from "@app/core/queue";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ShortPollingService extends IBlocksPollingService implements OnApplicationShutdown {
    private readonly logger = new Logger(ShortPollingService.name);
    private blockToPollNext: bigint = 1n;
    private pollingIntervalTime: number = 1000;
    private pollingTimeout: NodeJS.Timeout;

    constructor(
        @Inject(Web3Connection) private readonly web3: Web3,
        private readonly prisma: PrismaService,
        @Inject(QueueClient) private readonly queueClient: ClientProxy,
    ) {
        super();
    }

    public onApplicationShutdown(signal?: string | undefined) {
        clearInterval(this.pollingTimeout);
    }

    public async start() {
        const block = await this.prisma.block.upsert({
            where: {
                type: BlockType.Latest,
            },
            create: {
                type: BlockType.Latest,
                number: 0,
            },
            update: {}
        });
        this.blockToPollNext = block.number + 1n;

        this.logger.debug(`Polling started from block ${this.blockToPollNext} with interval ${this.pollingIntervalTime}ms`);
        this.poll();
    }

    private async poll() {
        const latestBlockNumber = await this.web3.eth.getBlockNumber();
        this.logger.debug(`Latest processed: ${this.blockToPollNext - 1n}, Latest on node: ${latestBlockNumber}`);

        if (latestBlockNumber <= this.blockToPollNext) {
            this.logger.debug(`No new blocks`);
        }

        const blocks = await this.getUnprocessedBlocks(latestBlockNumber - this.blockToPollNext + 1n);
        await this.processBlocks(blocks);

        this.pollingTimeout = setTimeout(() => this.poll(), this.pollingIntervalTime);
    }

    private async getUnprocessedBlocks(count: bigint) {
        const requests: Promise<Block>[] = [];

        const initialCount = count;
        while (count > 0) {
            const incr = initialCount - count;
            requests.push(this.web3.eth.getBlock(this.blockToPollNext + incr));
            
            count--;
        }

        return Promise.all(requests);
    }

    private async processBlocks(blocks: Block[]) {
        for (const block of blocks) {
            const blockNumber = BigInt(block.number);
            this.blockToPollNext = blockNumber + 1n;
            await this.prisma.block.update({
                where: {
                    type: BlockType.Latest,
                },
                data: {
                    number: blockNumber,
                },
            });
            this.queueClient.emit(QueuePatterns.NewBlock, { test: 123 });
            this.logger.debug(`Processed block ${block.number}`);
        }
    }
}
