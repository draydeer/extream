import { SubscriberInterface } from "./subscriber_interface";
import { OnComplete, OnData, OnError } from "../types";
export interface StreamInterface<T> {
    complete(): this;
    dispatch(): StreamInterface<T>;
    emit(data: T): this;
    emitAndComplete(data: T): this;
    error(error: any): this;
    first(): StreamInterface<T>;
    fork(): StreamInterface<T>;
    pause(): this;
    resume(): this;
    subscribe(onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    toPromise(): Promise<T>;
    toOnCompletePromise(): Promise<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
}
