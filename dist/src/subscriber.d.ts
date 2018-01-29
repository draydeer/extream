import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { OnComplete, OnData, OnError } from "./types";
/**
 * Subscriber.
 */
export declare class Subscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _isIsolated: boolean;
    protected _middleware: any;
    protected _onComplete: OnComplete;
    protected _onData: OnData<T>;
    protected _onError: OnError;
    protected _stream: StreamInterface<T>;
    readonly id: string;
    readonly isIsolated: boolean;
    readonly stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete);
    isolated(): this;
    unsubscribe(): this;
    once(): this;
    doComplete(): this;
    doData(data: T): this;
    doError(error: any): this;
    protected _processMiddleware(data?: T): T;
}
/**
 * Subscriber.
 */
export declare class UnsafeSubscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _isIsolated: boolean;
    protected _middleware: any;
    protected _stream: StreamInterface<T>;
    doComplete: OnComplete;
    doData: OnData<T>;
    doError: OnError;
    readonly id: string;
    readonly isIsolated: boolean;
    readonly stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete);
    isolated(): this;
    unsubscribe(): this;
    once(): this;
}
