import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { BlockConsumerApi } from '@app/core/client';
import { LoggingInterceptor } from '@app/core/interceptor/logging-interceptor';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: BlockConsumerApi.protobufPackage,
            protoPath: join(__dirname, '../block-consumer-api.proto'),
            url: 'blocks-consumer-api:' + process.env.BLOCK_CONSUMER_PORT,
        },
    });

    app.useGlobalInterceptors(new LoggingInterceptor);
    await app.listen();

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
