import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { StreamMiddleware, OnComplete, OnData, OnError } from "./types";
/**
 * Stream.
 */
export declare class Stream<T> implements StreamInterface<T> {
    protected _isPaused: boolean;
    protected _lastValue: T;
    protected _middlewares: StreamMiddleware<T>[];
    protected _middlewaresAfterDispatch: StreamMiddleware<T>[];
    protected _subscribers: {
        [key: string]: SubscriberInterface<T>;
    };
    protected _subscribersCount: number;
    protected _transmittedCount: number;
    static readonly COMPLETED: Error;
    static fromPromise<T>(promise: Promise<T>): StreamInterface<T>;
    static merge<T>(...asyncs: (Promise<T> | StreamInterface<T>)[]): StreamInterface<T>;
    constructor();
    readonly isPaused: boolean;
    readonly lastValue: T;
    readonly subscribersCount: number;
    readonly transmittedCount: number;
    complete(): this;
    emit(data: T): this;
    emitAndComplete(data: T): this;
    error(error: any): this;
    fork(): StreamInterface<T>;
    pause(): this;
    resume(): this;
    subscribe(onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    delay(milliseconds: number): this;
    dispatch(): this;
    exec(middleware: (data: T, stream?: StreamInterface<T>) => T | Promise<T>): this;
    filter(middleware: T | ((data: T, stream?: StreamInterface<T>) => boolean)): this;
    first(): this;
    map(middleware: (data: T, stream?: StreamInterface<T>) => T | Promise<T>): this;
    skip(count: number): this;
    toOnCompletePromise(): Promise<T>;
    toPromise(): Promise<T>;
    protected _complete(): this;
    protected _emit(data: T): Promise<Error | T>;
    protected _middlewareAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T>;
    protected _middlewareAfterDispatchAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T>;
    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this;
    protected _subscriberOnComplete(): this;
    protected _subscriberOnData(data: T): this;
    protected _subscriberOnError(error: any): this;
    protected onSubscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected onSubscriberRemove(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
}
