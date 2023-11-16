import { AuthGuard } from "@app/core/auth/guard";
import { Body, Controller, Get, Inject, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CreateMetadataDto, GetMetadata } from "./dto";
import { AuthRequest } from "@app/core/auth";
import { MetadataApi } from "@app/core/client";
import { ClientGrpc } from "@nestjs/microservices";
import { MetadataTag } from "../tags";

@Controller('metadata')
export class MetadataController {
    private api: MetadataApi.MetadataClient;

    constructor(
        @Inject(MetadataTag) private readonly client: ClientGrpc,
    ) {}
    
    public onModuleInit() {
        this.api = this.client.getService(MetadataApi.METADATA_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    public createMetadata(
        @Body() dto: CreateMetadataDto,
        @Req() req: AuthRequest,
    ) {
        return this.api.create({
            tokenId: dto.tokenId,
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            account: req.user.address,
            name: dto.name,
            description: dto.description,
            image: Buffer.from(dto.image, 'base64'),
        });
    }

    @Get('/:id')
    public getMetadata(
        @Param() dto: GetMetadata,
    ) {
        return this.api.findOne({
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            tokenId: dto.tokenId,
        });
    }
}
