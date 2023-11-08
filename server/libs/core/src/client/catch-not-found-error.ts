import { NotFoundException } from "@nestjs/common";
import { Observable, ObservableInput } from "rxjs";

export function catchNotFound<T, O extends ObservableInput<any>>(error: any, caught: Observable<T>): O {
    if (error.message.includes('Not Found')) {
        throw new NotFoundException();
    }

    throw error;
}
