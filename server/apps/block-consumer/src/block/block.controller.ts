import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class BlockController {
    @MessagePattern('test')
    public async test(@Payload() p: any) {
        
    }
}