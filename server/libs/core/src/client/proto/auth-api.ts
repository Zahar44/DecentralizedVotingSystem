/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "authapi";

export interface UpdateMessageRequest {
  value: string;
}

export interface UpdateMessageResponse {
}

export interface RequestValidationRequest {
  address: string;
}

export interface RequestValidationResponse {
  message: string;
}

export interface ValidateRequest {
  address: string;
  signarute: string;
}

export interface ValidateResponse {
  valid: boolean;
}

export const AUTHAPI_PACKAGE_NAME = "authapi";

export interface AuthClient {
  updateMessage(request: UpdateMessageRequest): Observable<UpdateMessageResponse>;

  requestValidation(request: RequestValidationRequest): Observable<RequestValidationResponse>;

  validate(request: ValidateRequest): Observable<ValidateResponse>;
}

export interface AuthController {
  updateMessage(
    request: UpdateMessageRequest,
  ): Promise<UpdateMessageResponse> | Observable<UpdateMessageResponse> | UpdateMessageResponse;

  requestValidation(
    request: RequestValidationRequest,
  ): Promise<RequestValidationResponse> | Observable<RequestValidationResponse> | RequestValidationResponse;

  validate(request: ValidateRequest): Promise<ValidateResponse> | Observable<ValidateResponse> | ValidateResponse;
}

export function AuthControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["updateMessage", "requestValidation", "validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Auth", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Auth", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "Auth";
