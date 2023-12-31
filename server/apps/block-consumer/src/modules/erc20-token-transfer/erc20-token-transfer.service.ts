import { Injectable, Logger } from "@nestjs/common";
import Web3, { Log } from "web3";
import { PrismaService } from "../prisma/prisma.service";
import { decodeParameter } from 'web3-eth-abi';
import { ERC20TokenService } from "../erc20-token/erc20-token.service";
import { fromUnit } from "@app/core/web3";
import { TokenERC20 } from "apps/block-consumer/prisma/client";

@Injectable()
export class ERC20TokenTransferService {
    private readonly logger = new Logger(ERC20TokenTransferService.name);

    constructor(
        private readonly tokenService: ERC20TokenService,
        private readonly prisma: PrismaService,
    ) {}

    public async handleLog(log: Log) {
        if (!log.topics || !log.data) return;

        const from      = decodeParameter('address', log.topics[1].toString()) as string;
        const to        = decodeParameter('address', log.topics[2].toString()) as string;
        const amount    = decodeParameter('uint256', log.data.toString()) as bigint;
        this.logger.debug(`${amount}: ${from} => ${to}`);

        const token = await this.tokenService.getOrCreateToken(log.address!);
        const amountEther = fromUnit(amount, token.decimals);
        
        await this.addBalance(token, to, Number(amountEther));
    }

    private async addBalance(
        token: TokenERC20,
        accountAddress: string,
        amountEtherToAdd: number,
    ) {
        const balancesCount = await this.prisma.balanceERC20.count({
            where: {
                account: {
                    address: accountAddress,
                },
                token: {
                    address: token.address,
                },
            },
        });
        const balanceExist = balancesCount > 0;

        if (!balanceExist) {
            const balance = await this.tokenService.getBalance(token.address, accountAddress);
            const balanceEther = fromUnit(balance, token.decimals);
            amountEtherToAdd = Number(balanceEther);
        }

        const account = await this.prisma.account.upsert({
            where: {
                address: accountAddress,
            },
            create: {
                address: accountAddress,
            },
            update: {},
        });

        await this.prisma.balanceERC20.upsert({
            create: {
                account: {
                    connect: {
                        address: accountAddress,
                    },
                },
                token: {
                    connect: {
                        address: token.address,
                    },
                },
                value: amountEtherToAdd,
            },
            update: {
                value: { increment: amountEtherToAdd },
            },
            where: {
                tokenId_accountId: {
                    accountId: account.id,
                    tokenId: token.id,
                },
            },
        });
    }
}
