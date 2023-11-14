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

export interface LoginRequest {
  address: string;
  signature: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutRequest {
  token: string;
}

export interface LogoutResponse {
}

export const AUTHAPI_PACKAGE_NAME = "authapi";

export interface AuthClient {
  updateMessage(request: UpdateMessageRequest): Observable<UpdateMessageResponse>;

  requestValidation(request: RequestValidationRequest): Observable<RequestValidationResponse>;

  login(request: LoginRequest): Observable<LoginResponse>;

  refresh(request: RefreshRequest): Observable<RefreshResponse>;

  logout(request: LogoutRequest): Observable<LogoutResponse>;
}

export interface AuthController {
  updateMessage(
    request: UpdateMessageRequest,
  ): Promise<UpdateMessageResponse> | Observable<UpdateMessageResponse> | UpdateMessageResponse;

  requestValidation(
    request: RequestValidationRequest,
  ): Promise<RequestValidationResponse> | Observable<RequestValidationResponse> | RequestValidationResponse;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  refresh(request: RefreshRequest): Promise<RefreshResponse> | Observable<RefreshResponse> | RefreshResponse;

  logout(request: LogoutRequest): Promise<LogoutResponse> | Observable<LogoutResponse> | LogoutResponse;
}

export function AuthControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["updateMessage", "requestValidation", "login", "refresh", "logout"];
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
