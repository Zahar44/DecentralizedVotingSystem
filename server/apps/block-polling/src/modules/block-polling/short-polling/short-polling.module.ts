import { Module } from "@nestjs/common";
import { ShortPollingService } from "./short-polling.service";
import { DispatchBlockModule } from "../../dispatch-block/dispatch-block.module";

@Module({
    imports: [DispatchBlockModule],
    providers: [ShortPollingService],
    exports: [ShortPollingService],
})
export class ShortPollingModule {}