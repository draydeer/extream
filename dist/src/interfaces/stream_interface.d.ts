import { SubscriberInterface } from "./subscriber_interface";
export interface StreamInterface<T> {
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    pause(): this;
    resume(): this;
    subscribe(onData: (data: T) => any, onError?: (error: any) => any, onComplete?: () => any): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
}
