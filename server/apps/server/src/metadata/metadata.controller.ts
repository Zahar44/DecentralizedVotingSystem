import { AuthGuard } from "@app/core/auth/guard";
import { Body, Controller, Inject, OnModuleInit, Post, Req, UseGuards } from "@nestjs/common";
import { CreateMetadataDto } from "./dto";
import { AuthRequest } from "@app/core/auth";
import { BlockConsumerTag } from "../tags";
import { ClientGrpc } from "@nestjs/microservices";
import { BlockConsumerApi } from "@app/core/client";
import { firstValueFrom } from "rxjs";

@Controller('metadata')
export class MetadataController implements OnModuleInit {
    private api: BlockConsumerApi.BalanceERC721Client;

    constructor(
        @Inject(BlockConsumerTag) private readonly client: ClientGrpc,
    ) {}

    public onModuleInit() {
        this.api = this.client.getService(BlockConsumerApi.BALANCE_ER_C721_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    public async createMetadata(
        @Body() dto: CreateMetadataDto,
        @Req() req: AuthRequest,
    ) {
        const res = await firstValueFrom(this.api.findOne({
            account: req.user.address,
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
        }));
        console.log(res.values);
    }
}