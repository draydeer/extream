import {SubscriberInterface} from "./subscriber_interface";
import {OnComplete, OnData, OnError, PromiseOrT} from "../types";

export interface StreamInterface<T> {
    readonly isCompleted: boolean;
    readonly isShared: boolean;
    readonly root: this;
    readonly subscribers: SubscriberInterface<T>[];

    autoComplete(): this;
    await(): this;
    cold(): this;
    complete(subscribers?: SubscriberInterface<T>[]): this;
    debounce(seconds: number): this;
    debug(callback: (data: T, stream?: StreamInterface<T>) => void): this;
    dispatch(): this;
    emit(data: T, subscribers?: SubscriberInterface<T>[]): this;
    emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this;
    error(error: any, subscribers?: SubscriberInterface<T>[]): this;
    exec(middleware: (data: T, stream?: StreamInterface<T>) => PromiseOrT<T>): this;
    filter(middleware: T|((data: T, stream?: StreamInterface<T>) => boolean)): this;
    first(): this;
    fork(): this;
    getCompatible(): this;
    pause(): this;
    progressive(): this;
    redirect(selector: (data: T) => string, streams: {[key: string]: StreamInterface<T>}): this;
    reduce(reducer: (accumulator: T, data: T, count?: number) => PromiseOrT<T>, accumulator: T): this;
    resume(): this;
    select(selector: (data: T) => string, streams: {[key: string]: StreamInterface<T>}): this;
    setRoot(stream: StreamInterface<T>): this;
    shared(): this;
    subscribe(onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete<T>): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    synchronized(): this;
    throttle(seconds: number): this;
    toCompletionPromise(): Promise<T>;
    toErrorPromise(): Promise<T>;
    toPromise(): Promise<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    waitFor(stream: StreamInterface<T>): this;
    waitForCompletion(stream: StreamInterface<T>): this;
    waitForError(stream: StreamInterface<T>): this;
}
