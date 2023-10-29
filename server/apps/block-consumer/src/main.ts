import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QueueTypes } from '@app/core/queue/queue-types';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
                urls: ['amqp://localhost:5672'],
                queue: QueueTypes.Block,
                queueOptions: {
                    durable: false
            },
        },
    });

    await app.listen();
    
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
