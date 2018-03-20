import { BufferInterface } from "./interfaces/buffer_interface";
import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { Storage } from './storage';
import { StreamMiddleware, OnComplete, OnData, OnError } from "./types";
import { PromiseOrT } from "./types";
import { ResourceInterface } from './interfaces/resource_interface';
/**
 * Stream.
 */
export declare class Stream<T> implements StreamInterface<T> {
    protected _isAutocomplete: boolean;
    protected _isCompleted: boolean;
    protected _isPaused: boolean;
    protected _isProcessing: boolean;
    protected _isProgressive: boolean;
    protected _isSynchronized: boolean;
    protected _lastValue: T;
    protected _middlewares: StreamMiddleware<T>[];
    protected _middlewaresAfterDispatch: StreamMiddleware<T>[];
    protected _postbuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _prebuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _resources: ResourceInterface<any>[];
    protected _root: StreamInterface<T>;
    protected _subscribers: Storage<SubscriberInterface<T>>;
    protected _transmittedCount: number;
    static readonly COMPLETED: Error;
    static fromPromise<T>(promise: Promise<T>): StreamInterface<T>;
    static merge<T>(...asyncs: (Promise<T> | StreamInterface<T>)[]): StreamInterface<T>;
    constructor();
    readonly compatible: this;
    readonly isCompleted: boolean;
    readonly isPaused: boolean;
    readonly lastValue: T;
    readonly root: this;
    readonly subscribers: SubscriberInterface<T>[];
    readonly subscribersCount: number;
    readonly transmittedCount: number;
    setRoot(stream: StreamInterface<T>): this;
    /**
     * Enables automatic completion of stream if count of subscribers becomes zero.
     */
    autocomplete(): this;
    complete(subscribers?: SubscriberInterface<T>[]): this;
    emit(data: T, subscribers?: SubscriberInterface<T>[]): this;
    emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this;
    error(error: any, subscribers?: SubscriberInterface<T>[]): this;
    fork(): this;
    /**
     * Pauses stream stopping processing of emitted values.
     */
    pause(): this;
    /**
     * Initiates post buffer where emitted and processed values will be stored before to be sent to subscribers.
     */
    postbuffer(size?: number): this;
    /**
     * Initiates pre buffer where emitted values will be stored before to be processed.
     */
    prebuffer(size?: number): this;
    /**
     * Enables progressive mode when added middleware will be chained inside current stream instead initiate new one.
     */
    progressive(): this;
    /**
     * Resumes stream starting processing of emitted values.
     */
    resume(): this;
    /**
     *
     */
    synchronized(): this;
    subscribe(onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>): SubscriberInterface<T>;
    subscribeOnComplete(onComplete?: OnComplete<T>): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    await(): this;
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
    /** Continues processing after expiration of  */
    throttle(seconds: number): this;
    waitFor(stream: StreamInterface<T>): this;
    waitForCompletion(stream: StreamInterface<T>): this;
    waitForError(stream: StreamInterface<T>): this;
    toCompletionPromise(): Promise<T>;
    toErrorPromise(): Promise<T>;
    toPromise(): Promise<T>;
    protected _assertReady(): this;
    protected _emitLoop(subscribers: any, middlewareIndex: any, cb: any, data: any): any;
    protected _middlewareAdd(middleware: StreamMiddleware<T>, progressive?: boolean): this;
    protected _middlewareAfterDispatchAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T>;
    protected _resourceAdd(resource: ResourceInterface<any>): ResourceInterface<any>;
    protected _shutdown(): this;
    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this;
    protected _subscriberOnComplete(subscribers?: SubscriberInterface<T>[]): this;
    protected _subscriberOnData(data: T, subscribers?: SubscriberInterface<T>[]): this;
    protected _subscriberOnError(error: any, subscribers?: SubscriberInterface<T>[]): this;
    protected onSubscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected onSubscriberRemove(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
}
