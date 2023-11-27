import { AuthGuard } from "@app/core/auth/guard";
import { Body, Controller, Get, Inject, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateMetadataDto, GetMetadataRequestDto, GetMetadataResponseDto } from "./dto";
import { AuthRequest } from "@app/core/auth";
import { MetadataApi } from "@app/core/client";
import { ClientGrpc } from "@nestjs/microservices";
import { MetadataTag } from "../tags";
import { firstValueFrom } from "rxjs";
import { Response, Request } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('metadata')
export class MetadataController {
    private metadata: MetadataApi.MetadataClient;
    private metadataImage: MetadataApi.MetadataImageClient;

    constructor(
        @Inject(MetadataTag) private readonly client: ClientGrpc,
    ) {}
    
    public onModuleInit() {
        this.metadata = this.client.getService(MetadataApi.METADATA_SERVICE_NAME);
        this.metadataImage = this.client.getService(MetadataApi.METADATA_IMAGE_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    public createMetadata(
        @Body() dto: CreateMetadataDto,
        @Req() req: AuthRequest,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.metadata.setImage({
            tokenId: dto.tokenId,
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            account: req.user.address,
            image: file.buffer,
        });
    }

    @Get('/:tokenId')
    public async getOneMetadata(
        @Req() req: Request,
        @Param() dto: GetMetadataRequestDto,
    ): Promise<GetMetadataResponseDto> {
        const resp = await firstValueFrom(this.metadata.findOne({
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            tokenId: dto.tokenId,
        }));

        return {
            tokenId: resp.tokenId,
            name: resp.name,
            description: resp.description,
            image: `${req.protocol}://${req.get('Host')}${req.originalUrl}/image`,
        };
    }

    @Get('/:tokenId/image')
    public async getOneMetadataImage(
        @Res() resp: Response,
        @Param() dto: GetMetadataRequestDto,
    ) {
        const data = await firstValueFrom(this.metadataImage.findOne({
            token: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
            tokenId: dto.tokenId,
        }));
        resp.setHeader('Content-Type', 'image/png');
        resp.send(data.image);
    }

    @Get()
    public async getMetadata(
        @Req() req: Request,
    ): Promise<GetMetadataResponseDto[]> {
        const resp = await firstValueFrom(this.metadata.findAll({}));
        return (resp.data || []).map((d): GetMetadataResponseDto => ({
            tokenId: d.tokenId,
            name: d.name,
            description: d.description,
            image: `${req.protocol}://${req.get('Host')}${req.originalUrl}/${d.tokenId}/image`,
        }));
    }
}
