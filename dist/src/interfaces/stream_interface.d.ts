import { SubscriberInterface } from "./subscriber_interface";
import { OnComplete, OnData, OnError } from "../types";
export interface StreamInterface<T> {
    readonly clone: this;
    readonly root: this;
    complete(): this;
    debug(callback: (data: T, stream?: StreamInterface<T>) => void): this;
    dispatch(): this;
    emit(data: T, subscribers?: SubscriberInterface<T>[]): this;
    emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this;
    error(error: any): this;
    exec(middleware: (data: T, stream?: StreamInterface<T>) => T | Promise<T>): this;
    filter(middleware: T | ((data: T, stream?: StreamInterface<T>) => boolean)): this;
    first(): this;
    fork(): this;
    pause(): this;
    resume(): this;
    select(selector: (data: T) => string, streams: {
        [key: string]: StreamInterface<T>;
    }): this;
    setRoot(stream: StreamInterface<T>): this;
    subscribe(onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    toCompletionPromise(): Promise<T>;
    toErrorPromise(): Promise<T>;
    toPromise(): Promise<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    waitFor(stream: StreamInterface<T>): this;
    waitForCompletion(stream: StreamInterface<T>): this;
    waitForError(stream: StreamInterface<T>): this;
}
