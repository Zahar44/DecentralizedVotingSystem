import { Injectable, Logger } from "@nestjs/common";
import { Log } from "web3";
import { PrismaService } from "../prisma/prisma.service";
import { decodeParameter } from 'web3-eth-abi';

@Injectable()
export class ERC721TokenTransferService {
    private readonly logger = new Logger(ERC721TokenTransferService.name);

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    public async handleLog(log: Log) {
        if (!log.topics || !log.data) return;

        const from      = decodeParameter('address', log.topics[1].toString()) as string;
        const to        = decodeParameter('address', log.topics[2].toString()) as string;
        const tokenId   = +(decodeParameter('uint256', log.topics[3].toString()) as bigint).toString();
        if (from === '0x0000000000000000000000000000000000000000') return;
        this.logger.debug(`${tokenId}: ${from} => ${to}`);

        const token = await this.prisma.tokenERC721.upsert({
            create: {
                address: log.address!,
            },
            where: {
                address: log.address!,
            },
            update: {},
        });
        
        const account = await this.prisma.account.upsert({
            where: {
                address: to,
            },
            create: {
                address: to,
            },
            update: {},
        });

        await this.prisma.balanceERC721.upsert({
            create: {
                accountId: account.id,
                tokenId: token.id,
            },
            where: {
                tokenId_accountId: {
                    accountId: account.id,
                    tokenId: token.id,
                },
            },
            update: {
                values: {
                    push: [tokenId],
                },
            },
        });
    }
}