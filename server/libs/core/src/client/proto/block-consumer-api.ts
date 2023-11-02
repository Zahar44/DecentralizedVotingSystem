/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "bcapi";

export interface BalanceByAddress {
  token: string;
  account: string;
}

export interface Balance {
  value: number;
}

export const BCAPI_PACKAGE_NAME = "bcapi";

export interface BalanceServiceClient {
  findOne(request: BalanceByAddress): Observable<Balance>;
}

export interface BalanceServiceController {
  findOne(request: BalanceByAddress): Promise<Balance> | Observable<Balance> | Balance;
}

export function BalanceServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("BalanceService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("BalanceService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BALANCE_SERVICE_NAME = "BalanceService";
