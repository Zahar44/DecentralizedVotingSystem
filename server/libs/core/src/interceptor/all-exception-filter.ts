import { ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException, Injectable, Logger } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Request, Response } from 'express';
import { RpcExceptionStatusByMessage } from "../exceptions/rpc";

@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionFilter.name);

    catch(exception: any, context: ArgumentsHost) {
        const http = context.switchToHttp();
        const req = http.getRequest<Request>();
        const resp = http.getResponse<Response>();

        let errors: string[];
        let status: HttpStatus;
        if (exception instanceof HttpException) {
            [errors, status] = this.getHttpExceptionErrors(exception);
        } else if (exception instanceof RpcException) {
            [errors, status] = this.getRpcExceptionErrors(exception);
        } else {
            [errors, status] = this.getDefaultExceptionErrors();
        }

        this.logger.error(`Error on ${req.url}, ${errors.join(',')}`);

        resp
            .status(status)
            .json({
                errors,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
    }

    private getHttpExceptionErrors(exception: HttpException) {
        const response = exception.getResponse();
        const message = (typeof response === 'object' && 'message' in response) ?
            response.message as string : exception.message;
        const errors = Array.isArray(message) ? message as string[] : [message];
        return [errors, exception.getStatus()] as const;
    }

    private getRpcExceptionErrors(exception: RpcException) {
        const error = exception.getError();
        const message = typeof error === 'object' ? (error as any).details : error;
        const status = RpcExceptionStatusByMessage[message];
        if (status === undefined) {
            this.logger.warn('Unknown rpc exception: ' + message);
            return this.getDefaultExceptionErrors();
        }

        const errors = [message];
        return [errors, status] as const;
    }

    private getDefaultExceptionErrors() {
        const exception = new InternalServerErrorException();
        const errors = [exception.message];
        return [errors, exception.getStatus()] as const;
    }
}
