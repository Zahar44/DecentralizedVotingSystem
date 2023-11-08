import { Controller, Post } from "@nestjs/common";

@Controller('metadata')
export class MetadataController {
    @Post()
    public async createMetadata() {}
}