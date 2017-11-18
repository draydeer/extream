import { SubscriberInterface } from "./subscriber_interface";
export interface StreamInterface<T> {
    complete(): this;
    emit(data: T): this;
    emitAndComplete(data: T): this;
    error(error: any): this;
    filter(middleware: T | ((data: T, stream?: StreamInterface<T>) => boolean)): this;
    fork(): StreamInterface<T>;
    pause(): this;
    resume(): this;
    subscribe(onData: (data: T) => any, onError?: (error: any) => any, onComplete?: () => any): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
}
