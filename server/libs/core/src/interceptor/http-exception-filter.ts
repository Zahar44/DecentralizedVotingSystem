import { ArgumentsHost, ExceptionFilter, HttpException, Injectable, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, context: ArgumentsHost) {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const resp = http.getResponse<Response>();

        this.logger.error(`Error on ${req.url}, ${exception}`);
        const message = exception.getResponse();

        resp
            .status(exception.getStatus())
            .json({
                errors: Array.isArray(message) ? message : [message],
                timestamp: new Date().toISOString(),
                path: req.url,
            });
    }
}
