/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "bcapi";

export interface BalanceByAddress {
  token: string;
  account: string;
}

export interface BalanceERC20Response {
  value: number;
}

export interface BalanceERC721Response {
  values: number[];
}

export const BCAPI_PACKAGE_NAME = "bcapi";

export interface BalanceERC20Client {
  findOne(request: BalanceByAddress): Observable<BalanceERC20Response>;
}

export interface BalanceERC20Controller {
  findOne(
    request: BalanceByAddress,
  ): Promise<BalanceERC20Response> | Observable<BalanceERC20Response> | BalanceERC20Response;
}

export function BalanceERC20ControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("BalanceERC20", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("BalanceERC20", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BALANCE_ER_C20_SERVICE_NAME = "BalanceERC20";

export interface BalanceERC721Client {
  findOne(request: BalanceByAddress): Observable<BalanceERC721Response>;
}

export interface BalanceERC721Controller {
  findOne(
    request: BalanceByAddress,
  ): Promise<BalanceERC721Response> | Observable<BalanceERC721Response> | BalanceERC721Response;
}

export function BalanceERC721ControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("BalanceERC721", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("BalanceERC721", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const BALANCE_ER_C721_SERVICE_NAME = "BalanceERC721";
