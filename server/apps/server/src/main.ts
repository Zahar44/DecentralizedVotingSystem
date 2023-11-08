import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@app/core/interceptor/logging-interceptor';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

	app.useGlobalInterceptors(new LoggingInterceptor);
	await app.listen(3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
