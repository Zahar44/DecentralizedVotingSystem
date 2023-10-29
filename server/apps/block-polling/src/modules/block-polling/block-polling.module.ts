import { DynamicModule, Inject, Module } from "@nestjs/common";
import { IBlocksPollingService } from "../../common/blocks-polling-service";
import Web3 from "web3";
import { Web3Connection } from "@app/core/web3";
import { ShortPollingService } from "./short-polling/short-polling.service";
import { ShortPollingModule } from "./short-polling/short-polling.module";

@Module({
    imports: [ShortPollingModule],
})
export class BlockPollingModule {
    static register(): DynamicModule {
        return {
            module: BlockPollingModule,
            providers: [
                {
                    inject: [Web3Connection, ShortPollingService],
                    provide: IBlocksPollingService,
                    useFactory(web3: Web3, short: ShortPollingService) {
                        if (!web3.eth.provider?.supportsSubscriptions()) {
                            return short;
                        }
                    },
                }
            ]
        };
    }
}
