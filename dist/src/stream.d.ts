import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { StreamBuffer } from "./stream_buffer";
/**
 * Stream.
 */
export declare class Stream<T> implements StreamInterface<T> {
    protected _emitBuffer: StreamBuffer<T>;
    protected _flow: ((data: T, stream?: Stream<T>) => T | Promise<T> | Error)[];
    protected _isPaused: boolean;
    protected _lastValue: T;
    protected _subscribeBuffer: StreamBuffer<T>;
    protected _subscribers: {
        [key: string]: SubscriberInterface<T>;
    };
    protected _transmittedCount: number;
    static readonly COMPLETED: Error;
    constructor(master?: (stream: StreamInterface<T>) => any);
    readonly lastValue: T;
    readonly transmittedCount: number;
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    initEmitBuffer(maxLength?: number): this;
    initSubscribeBuffer(maxLength?: number): this;
    pause(): this;
    resume(): this;
    subscribe(onData?: (data: T) => any, onError?: (error: any) => any, onComplete?: () => any): SubscriberInterface<T>;
    subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T>;
    unsubscribe(subscriber: SubscriberInterface<T>): this;
    delay(milliseconds: number): this;
    exec(middleware: T | Promise<T> | ((data: T, stream?: Stream<T>) => T | Promise<T>)): this;
    filter(middleware: T | ((data: T, stream?: Stream<T>) => boolean)): this;
    first(middleware: ((data: T, stream?: Stream<T>) => T | Promise<T>)): this;
    fork(): StreamInterface<T>;
    map(middleware: (data: T, stream?: Stream<T>) => T | Promise<T>): this;
    toPromise(): Promise<T>;
    toOnCompletePromise(): Promise<T>;
    protected _complete(): this;
    protected _emit(data: T): Promise<Error | T>;
    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T>;
    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this;
    protected _subscriberOnComplete(): this;
    protected _subscriberOnData(data: T): this;
    protected _subscriberOnError(error: any): this;
}
