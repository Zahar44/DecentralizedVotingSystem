import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { join } from "path";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory() {
                return {
                    store: redisStore,
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                }
            }
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
        AuthModule,
    ],
})
export class AppModule { }