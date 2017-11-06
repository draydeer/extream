import { Deferred } from "./deferred";
import { StreamInterface } from "./interfaces/stream_interface";
/**
 * Async wrapper with incoming and outgoing streams.
 */
export declare class Executor<T> {
    protected _async: Promise<T>;
    protected _cancelled: Deferred<T>;
    protected _incoming: StreamInterface<T>;
    protected _outgoing: StreamInterface<T>;
    static readonly CANCELLED: Error;
    constructor(asyncFactory: (executor: Executor<T>) => Promise<T>);
    readonly async: Promise<T>;
    readonly incoming: StreamInterface<T>;
    readonly isCancelled: boolean;
    readonly outgoing: StreamInterface<T>;
    readonly promise: Promise<T>;
    /**
     * Generates Promise.all with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param promises
     *
     * @returns {Promise<T[]>|any}
     */
    all(promises: Promise<T>[]): Promise<T[]>;
    /**
     * Completes executor closing incoming and outgoing streams.
     *
     * @returns {Executor}
     */
    complete(): this;
    /**
     * Cancel executor rejecting cancelled deferred.
     */
    cancel(): this;
    /**
     * Emits data to incoming stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    emit(data: T): this;
    /**
     * Generates Promise.race with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param promises
     *
     * @returns {Promise<T>}
     */
    race(promises: Promise<T>[]): Promise<T>;
    /**
     * Sends data to outgoing stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    send(data: T): this;
    /**
     * Subscribes external executor streams.
     *
     * @param executor
     *
     * @returns {Executor}
     */
    subscribeExecutor(executor: Executor<T>): this;
    /**
     * Subscribes internal incoming stream to some external so that external data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    subscribeIncomingToStream(stream: StreamInterface<T>): this;
    /**
     * Subscribes some external stream to internal outgoing so that internal data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    subscribeStreamToOutgoing(stream: StreamInterface<T>): this;
}
