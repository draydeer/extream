import { Deferred } from "./deferred";
import { StreamInterface } from "./interfaces/stream_interface";
/**
 * Async deferred wrapper with incoming and outgoing streams.
 */
export declare class Executor<T> {
    protected _cancelled: Deferred<boolean>;
    protected _deferred: Promise<T>;
    protected _incoming: StreamInterface<T>;
    protected _outgoing: StreamInterface<T>;
    readonly deferred: Promise<T>;
    readonly incoming: StreamInterface<T>;
    readonly isCancelled: boolean;
    readonly outgoing: StreamInterface<T>;
    constructor(deferredFactory: (executor: Executor<T>) => Promise<T>);
    complete(): this;
    subscribeExecutor(executor: Executor<T>): this;
    subscribeIncomingToStream(stream: StreamInterface<T>): this;
    subscribeStreamToOutgoing(stream: StreamInterface<T>): this;
    /**
     * Emits data to incoming stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    emit(data: T): this;
    /**
     * Sends data to outgoing stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    send(data: T): this;
}
