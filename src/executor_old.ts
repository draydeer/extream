import {CANCELLED} from "./const";
import {Deferred} from "./deferred";
import {StreamInterface} from "./interfaces/stream_interface";
import {Stream} from "./stream";

/**
 * Async wrapper with incoming and outgoing streams.
 */
export class Executor<T> {

    protected _async: Promise<T>;
    protected _cancelled: Deferred<T>;
    protected _incoming: StreamInterface<T> = new Stream<T>();
    protected _outgoing: StreamInterface<T> = new Stream<T>();

    public static get CANCELLED(): Error {
        return CANCELLED;
    };

    constructor(asyncFactory: (executor: Executor<T>) => Promise<T>) {
        this._cancelled = new Deferred<T>();

        const async: Promise<T> = asyncFactory(this);

        if (false === async instanceof Promise) {
            throw new Error("Executor async factory must return async.");
        }

        this._async = async.then(
            (result: T) => {
                this.complete();

                return result;
            },
            (error: any) => {
                this.complete();

                throw error;
            }
        );
    }

    public get async(): Promise<T> {
        return this._async;
    }

    public get incoming(): StreamInterface<T> {
        return this._incoming;
    }

    public get isCancelled(): boolean {
        return this._cancelled.isCompleted;
    }

    public get outgoing(): StreamInterface<T> {
        return this._outgoing;
    }

    public get promise(): Promise<T> {
        return this._async;
    }

    /**
     * Generates Promise.all with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param asyncs
     *
     * @returns {Promise<T[]>|any}
     */
    public all(asyncs: (Promise<T>|StreamInterface<T>)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            Promise.all(asyncs).then(resolve, reject);

            this._cancelled.promise.catch(reject);
        });
    }

    /**
     * Completes executor closing incoming and outgoing streams.
     *
     * @returns {Executor}
     */
    public complete(): this {
        this._incoming.complete();

        this._outgoing.complete();

        return this;
    }

    /**
     * Cancel executor rejecting cancelled deferred.
     */
    public cancel(): this {
        this._cancelled.reject(CANCELLED);

        return this;
    }

    /**
     * Emits data to incoming stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    public emit(data: T): this {
        this._incoming.emit(data);

        return this;
    }

    /**
     * Generates Promise.race with scheduled executor cancellation so that on cancel rejects with CANCELLED.
     *
     * @param promises
     *
     * @returns {Promise<T>}
     */
    public race(promises: Promise<T>[]): Promise<T> {
        const promisesList = Array.from<Promise<T>>(promises);

        promisesList.push(this._cancelled.promise);

        return Promise.race<T>(promisesList);
    }

    /**
     * Sends data to outgoing stream.
     *
     * @param data
     *
     * @returns {Executor}
     */
    public send(data: T): this {
        this._outgoing.emit(data);

        return this;
    }

    /**
     * Subscribes external executor streams.
     *
     * @param executor
     *
     * @returns {Executor}
     */
    public subscribeExecutor(executor: Executor<T>): this {
        this.subscribeIncomingToStream(executor.incoming).subscribeStreamToOutgoing(executor.outgoing);

        return this;
    }

    /**
     * Subscribes internal incoming stream to some external so that external data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    public subscribeIncomingToStream(stream: StreamInterface<T>): this {
        stream.subscribeStream(this._incoming);

        return this;
    }

    /**
     * Subscribes some external stream to internal outgoing so that internal data will be redirected to it.
     *
     * @param stream
     *
     * @returns {Executor}
     */
    public subscribeStreamToOutgoing(stream: StreamInterface<T>): this {
        this._outgoing.subscribeStream(stream);

        return this;
    }

}
