import { ClientGrpcProxy, RpcException } from "@nestjs/microservices";

export class RpcErrorSerializer extends ClientGrpcProxy {
    serializeError(err: any) {
        return new RpcException(err);
    }
}
