import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MetadataModule } from './metadata/metadata.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: join(process.cwd(), '.env'),
        }),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
        }),
        AuthModule,
        MetadataModule,
    ],
})
export class AppModule {}
