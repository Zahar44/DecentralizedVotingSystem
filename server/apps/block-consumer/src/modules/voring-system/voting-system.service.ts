import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Log } from "web3";
import { MetadataTag } from "../../tags";
import { ClientGrpc } from "@nestjs/microservices";
import { MetadataApi } from "@app/core/client";
import { decodeLog } from 'web3-eth-abi';
import { VotingSystemEvents } from "@app/core/web3/abi";
import { DecodedVotingCreated } from "./types";
import { firstValueFrom } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class VotingSystemService implements OnModuleInit {
    private readonly logger = new Logger(VotingSystemService.name);
    private metadata: MetadataApi.MetadataClient;

    constructor(
        @Inject(MetadataTag) private readonly client: ClientGrpc,
        private readonly prisma: PrismaService,
    ) {}

    public onModuleInit() {
        this.metadata = this.client.getService(MetadataApi.METADATA_SERVICE_NAME);
    }

    public async votingCreated(log: Log) {
        if (!log.data || !log.topics) return;
        const decoded = decodeLog<DecodedVotingCreated>(
            VotingSystemEvents.votingCreated.inputs,
            log.data.toString(),
            log.topics.map((t) => t.toString())
        );

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
                address: decoded.issuer,
            },
            create: {
                address: decoded.issuer,
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
                    push: [+decoded.projectId.toString()],
                },
            },
        });

        await firstValueFrom(this.metadata.create({
            account: decoded.issuer,
            token: log.address!,
            tokenId: +decoded.projectId.toString(),
            name: decoded.props.name,
            description: decoded.props.description,
        }));
    }

    public async voted(log: Log) {
        this.logger.log('voted');
    }
}
