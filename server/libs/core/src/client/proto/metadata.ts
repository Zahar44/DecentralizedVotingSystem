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
  tokenId: number;
  title: string;
  type: string;
}

export interface FindAllRequest {
}

export interface FindAllResponse {
  data: FindOneResponse[];
}

export interface FindOneImageRequest {
  token: string;
  tokenId: number;
}

export interface FindOneImageResponse {
  image: Uint8Array;
}

export const METADATA_PACKAGE_NAME = "metadata";

export interface MetadataClient {
  create(request: CreateRequest): Observable<CreateResponse>;

  findOne(request: FindOneRequest): Observable<FindOneResponse>;

  findAll(request: FindAllRequest): Observable<FindAllResponse>;
}

export interface MetadataController {
  create(request: CreateRequest): Promise<CreateResponse> | Observable<CreateResponse> | CreateResponse;

  findOne(request: FindOneRequest): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  findAll(request: FindAllRequest): Promise<FindAllResponse> | Observable<FindAllResponse> | FindAllResponse;
}

export function MetadataControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create", "findOne", "findAll"];
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

export interface MetadataImageClient {
  findOne(request: FindOneImageRequest): Observable<FindOneImageResponse>;
}

export interface MetadataImageController {
  findOne(
    request: FindOneImageRequest,
  ): Promise<FindOneImageResponse> | Observable<FindOneImageResponse> | FindOneImageResponse;
}

export function MetadataImageControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MetadataImage", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MetadataImage", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const METADATA_IMAGE_SERVICE_NAME = "MetadataImage";
