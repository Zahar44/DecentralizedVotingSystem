/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "metadata";

export interface CreateRequest {
  token: string;
  tokenId: number;
  account: string;
  name: string;
  description: string;
  image: Uint8Array;
}

export interface CreateResponse {
}

export interface FindOneRequest {
  token: string;
  tokenId: number;
}

export interface FindOneResponse {
  title: string;
  type: string;
}

export const METADATA_PACKAGE_NAME = "metadata";

export interface MetadataClient {
  create(request: CreateRequest): Observable<CreateResponse>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;
}

export interface MetadataController {
  create(request: CreateRequest): Promise<CreateResponse> | Observable<CreateResponse> | CreateResponse;

  findOne(request: FindOneRequest): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;
}

export function MetadataControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Metadata", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Metadata", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const METADATA_SERVICE_NAME = "Metadata";
