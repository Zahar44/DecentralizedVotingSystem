import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";

@Controller()
export class TokenTransferService {
    constructor() {}

    @EventPattern('test')
    public async consume(@Payload() data: any) {
        console.log('test');
    }
}
