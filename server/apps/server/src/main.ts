import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from '@app/core/interceptor/logging-interceptor';
import { AllExceptionFilter } from '@app/core/interceptor/all-exception-filter';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true });

	app.useGlobalInterceptors(new LoggingInterceptor);
	app.useGlobalFilters(new AllExceptionFilter);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	await app.listen(3000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();
