import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { OnComplete, OnData, OnError } from "./types";
/**
 * Subscriber.
 */
export declare class Subscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _middleware: any;
    protected _onComplete: OnComplete;
    protected _onData: OnData<T>;
    protected _onError: OnError;
    protected _stream: StreamInterface<T>;
    readonly id: string;
    readonly stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete);
    unsubscribe(): this;
    once(): this;
    doComplete(): this;
    doData(data: T): this;
    doError(error: any): this;
    protected _processMiddleware(data?: T): T;
}
