import { BufferInterface } from "./interfaces/buffer_interface";
import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { Storage } from './storage';
import { StreamMiddleware, OnComplete, OnData, OnError } from "./types";
import { PromiseOrT } from "./types";
/**
 * Stream.
 */
export declare class Stream<T> implements StreamInterface<T> {
    protected _isEmptyLastValue: boolean;
    protected _isPaused: boolean;
    protected _isProcessing: boolean;
    protected _isProgressive: boolean;
    protected _isSynchronized: boolean;
    protected _lastValue: T;
    protected _middlewares: StreamMiddleware<T>[];
    protected _middlewaresAfterDispatch: StreamMiddleware<T>[];
    protected _postbuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _prebuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _root: StreamInterface<T>;
    protected _subscribers: Storage<SubscriberInterface<T>>;
    protected _transmittedCount: number;
    static readonly COMPLETED: Error;
    static fromPromise<T>(promise: Promise<T>): StreamInterface<T>;
    static merge<T>(...asyncs: (Promise<T> | StreamInterface<T>)[]): StreamInterface<T>;
    constructor();
    readonly compatible: this;
    readonly isPaused: boolean;
    readonly lastValue: T;
    readonly root: this;
    readonly subscribersCount: number;
    readonly transmittedCount: number;
    setRoot(stream: StreamInterface<T>): this;
    complete(): this;
    emit(data: T, subscribers?: SubscriberInterface<T>[]): this;
    emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this;
    error(error: any): this;
    fork(): this;
    emptyLastValue(): this;
    pause(): this;
    postbuffer(size?: number): this;
    prebuffer(size?: number): this;
    progressive(): this;
    resume(): this;
    synchronized(): this;
    subscribe(onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    /** Continues processing after expiration of  */
    debounce(seconds: number): this;
    /** Runs debug callback then returns incoming data as is */
    debug(callback: (data: T, stream?: StreamInterface<T>) => void): this;
    /** Dispatches data to subscribers ahead of processing by remained middlewares */
    dispatch(): this;
    /** Executes custom handler over data then returns result value or income data as is if returned value is undefined */
    exec(middleware: (data: T, stream?: StreamInterface<T>) => PromiseOrT<T>): this;
    /** Filters data comparing with initial value or by applying custom handler that returns boolean */
    filter(middleware: T | ((data: T, stream?: StreamInterface<T>) => boolean)): this;
    /** Completes after first value received */
    first(): this;
    /** Maps data by replacing by initial value or by applying custom handler */
    map(middleware: (data: T, stream?: StreamInterface<T>) => PromiseOrT<T>): this;
    /** Redirects data to selected stream */
    redirect(selector: (data: T) => string, streams: {
        [key: string]: StreamInterface<T>;
    }): this;
    reduce(reducer: (accumulator: T, data: T, count?: number) => T, accumulator: T): this;
    select(selector: (data: T) => string, streams: {
        [key: string]: StreamInterface<T>;
    }): this;
    skip(middleware: T | ((data: T, stream?: StreamInterface<T>) => boolean)): this;
    waitFor(stream: StreamInterface<T>): this;
    waitForCompletion(stream: StreamInterface<T>): this;
    waitForError(stream: StreamInterface<T>): this;
    toCompletionPromise(): Promise<T>;
    toErrorPromise(): Promise<T>;
    toPromise(): Promise<T>;
    protected _emitLoop(subscribers: any, middlewareIndex: any, cb: any, data: any): any;
    protected _middlewareAdd(middleware: StreamMiddleware<T>): this;
    protected _middlewareAfterDispatchAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T>;
    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this;
    protected _subscriberOnComplete(subscribers?: SubscriberInterface<T>[]): this;
    protected _subscriberOnData(data: T, subscribers?: SubscriberInterface<T>[]): this;
    protected _subscriberOnError(error: any, subscribers?: SubscriberInterface<T>[]): this;
    protected onSubscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected onSubscriberRemove(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
}
