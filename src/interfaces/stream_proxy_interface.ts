import {SubscriberInterface} from "./subscriber_interface";

export interface StreamMasterInterface<T> {
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
}
