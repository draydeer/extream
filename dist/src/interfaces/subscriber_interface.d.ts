import { StreamInterface } from "./stream_interface";
export interface SubscriberInterface<T> {
    readonly id: string;
    readonly isShared: boolean;
    readonly stream: StreamInterface<T>;
    doComplete(subscribers?: SubscriberInterface<T>[]): this;
    doData(data?: T, subscribers?: SubscriberInterface<T>[]): this;
    doError(error?: any, subscribers?: SubscriberInterface<T>[]): this;
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    once(): this;
    unsubscribe(): this;
}
