import { Web3Connection } from "@app/core/web3";
import { Inject, Injectable, Logger, OnApplicationShutdown } from "@nestjs/common";
import Web3, { Block } from "web3";
import { IBlocksPollingService } from "../../../common/blocks-polling-service";
import { PrismaService } from "../../prisma/prisma.service";
import { BlockType } from "apps/block-polling/prisma/client";
import { DispatchBlockService } from "../../dispatch-block/dispatch-block.service";

@Injectable()
export class ShortPollingService extends IBlocksPollingService implements OnApplicationShutdown {
    private readonly logger = new Logger(ShortPollingService.name);
    private latestPoll: Promise<void>;
    private lastPolledBlock: bigint = 1n;
    private pollingIntervalTime: number = 1000;
    private pollingTimeout: NodeJS.Timeout;

    constructor(
        @Inject(Web3Connection) private readonly web3: Web3,
        private readonly prisma: PrismaService,
        private readonly dispatcher: DispatchBlockService,
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
        this.lastPolledBlock = block.number;

        this.logger.debug(`Polling started from block ${this.lastPolledBlock} with interval ${this.pollingIntervalTime}ms`);
        this.latestPoll = this.poll();
    }

    private async poll() {
        await this.latestPoll?.catch((error) => this.logger.error(`Poll error ${error}`));
        const latestBlockNumber = await this.web3.eth.getBlockNumber();

        if (latestBlockNumber <= this.lastPolledBlock) {
            return this.schedulePoll();
        }

        const blocks = await this.getUnprocessedBlocks(latestBlockNumber - this.lastPolledBlock);
        await this.processBlocks(blocks);

        this.logger.debug(`Latest processed: ${this.lastPolledBlock}, Latest on node: ${latestBlockNumber}`);
        this.schedulePoll();
    }

    private async getUnprocessedBlocks(count: bigint) {
        const requests: Promise<Block>[] = [];

        const initialCount = count;
        while (count > 0) {
            const incr = initialCount - count + 1n;
            requests.push(this.web3.eth.getBlock(this.lastPolledBlock + incr));
            
            count--;
        }

        return Promise.all(requests);
    }

    private schedulePoll() {
        this.pollingTimeout = setTimeout(() => {
            this.latestPoll = this.poll();
        }, this.pollingIntervalTime);
    }

    private async processBlocks(blocks: Block[]) {
        for (const block of blocks) {
            const blockNumber = BigInt(block.number);

            const logs = await this.web3.eth.getPastLogs({ fromBlock: blockNumber, toBlock: blockNumber });
            await this.dispatcher.dispatchLogs(logs);

            await this.dispatcher.setBlockProcessed(blockNumber);
            this.lastPolledBlock = blockNumber;
        }
    }
}
