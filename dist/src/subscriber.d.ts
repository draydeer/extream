import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { OnComplete, OnData, OnError } from "./types";
/**
 * Subscriber.
 */
export declare class Subscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _middleware: any;
    protected _onComplete: OnComplete<T>;
    protected _onData: OnData<T>;
    protected _onError: OnError<T>;
    protected _stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>);
    readonly id: string;
    readonly stream: StreamInterface<T>;
    unsubscribe(): this;
    once(): this;
    doComplete(subscribers?: SubscriberInterface<T>[]): this;
    doData(data: T, subscribers?: SubscriberInterface<T>[]): this;
    doError(error: any, subscribers?: SubscriberInterface<T>[]): this;
    protected _processMiddleware(data?: T): T;
}
/**
 * Subscriber.
 */
export declare class UnsafeSubscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _isIsolated: boolean;
    protected _middleware: any;
    protected _onComplete: OnComplete<T>;
    protected _onData: OnData<T>;
    protected _onError: OnError<T>;
    protected _stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>);
    readonly id: string;
    readonly isIsolated: boolean;
    readonly stream: StreamInterface<T>;
    isolated(): this;
    unsubscribe(): this;
    once(): this;
    doComplete(subscribers?: SubscriberInterface<T>[]): this;
    doData(data: T, subscribers?: SubscriberInterface<T>[]): this;
    doError(error: any, subscribers?: SubscriberInterface<T>[]): this;
}
