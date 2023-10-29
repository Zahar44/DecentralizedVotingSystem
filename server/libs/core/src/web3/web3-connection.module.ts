import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Web3Connection } from "./web3-connection";
import Web3 from "web3";
import { Web3Config } from "./web3-config";

@Module({})
export class Web3ConnectionModule {
    static registerFromConfig(global: boolean): DynamicModule {
        return {
            global,
            module: Web3ConnectionModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: Web3Connection,
                    useFactory: (configService: ConfigService): Web3 => {
                        const config =
                            configService.get<Web3Config>(Web3Config);
                        if (!config) throw new Error(`Web3 config is not registered`);

                        if (!config.url)
                            throw new Error(`Web3 url empty`);

                        return new Web3(config.url);
                    },
                    inject: [ConfigService],
                },
            ],
            exports: [Web3Connection],
        };
    }
}
