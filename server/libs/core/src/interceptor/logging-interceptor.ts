import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const contextType = context.getType();
        let url = '';

        switch (contextType) {
            case 'http':
                const http = context.switchToHttp();
                const httpReq = http.getRequest<Request>();
                url = httpReq.url;
                break;
            case 'ws':
                const ws = context.switchToWs();
                url = ws.getPattern();
                break;
            case 'rpc':
                const rpc = context.switchToRpc();
                url = `rpc call ${Object.keys(rpc.getData()).join(', ')}`;
                break;
            default:
                break;
        }

        
        this.logger.log(`Before ${url}`);

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => this.logger.log(`After ${url} ${Date.now() - now}ms`)),
            );
    }
}
