import { SubscriberInterface } from "./interfaces/subscriber_interface";
import { StreamInterface } from "./interfaces/stream_interface";
/**
 * Subscriber.
 */
export declare class Subscriber<T> implements SubscriberInterface<T> {
    protected _id: string;
    protected _middleware: any;
    protected _onComplete: () => any;
    protected _onData: (value: T) => any;
    protected _onError: (error: any) => any;
    protected _stream: StreamInterface<T>;
    readonly id: string;
    readonly stream: StreamInterface<T>;
    constructor(stream: StreamInterface<T>, onData?: (data: T) => any, onError?: (error: any) => any, onComplete?: () => any);
    unsubscribe(): this;
    once(): this;
    doComplete(): this;
    doData(data: T): this;
    doError(error: any): this;
    protected _processMiddleware(data?: T): T;
}
