import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: 'localhost',
            port: 6379,
        }),
        AuthModule,
    ],
})
export class AppModule { }