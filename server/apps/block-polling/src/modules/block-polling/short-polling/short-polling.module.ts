import { Module } from "@nestjs/common";
import { ShortPollingService } from "./short-polling.service";
import { QueueClient, QueueTypes } from "@app/core/queue";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: QueueClient,
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: QueueTypes.Block,
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    providers: [ShortPollingService],
    exports: [ShortPollingService],
})
export class ShortPollingModule {}