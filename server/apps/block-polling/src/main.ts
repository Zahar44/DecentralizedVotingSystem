import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IBlocksPollingService } from './common/blocks-polling-service';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);

	const polling = app.get(IBlocksPollingService);
	await polling.start();

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
