import { HttpStatus } from "@nestjs/common";

export const RpcExceptionMessages = {
    400: {
        BadRequest: 'Bad Request',
    },
    401: {
        SignatureIsNotCorrect: 'Signature is not correct',
    },
    404: {
        NotFound: 'Not Found',
    },
    500: {
        InternalServerError: "Internal Server Error",
    }
} as const;

let exceptionStatusByError: { [key in string]?: HttpStatus } = {};
for (const [status, errors] of Object.entries(RpcExceptionMessages)) {
    for (const error of Object.values(errors)) {
        exceptionStatusByError[error] = +status as HttpStatus;
    }
}

export const RpcExceptionStatusByMessage = exceptionStatusByError;