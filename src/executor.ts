import {Deferred} from "./deferred";
import {StreamInterface} from "./interfaces/stream_interface";
import {Stream} from "./stream";

/**
 * Async deferred wrapper with incoming and outgoing streams.
 */
export class Executor<T> {

    protected _cancelled: Deferred<boolean>;
    protected _deferred: Promise<T>;
    protected _incoming: StreamInterface<T> = new Stream<T>();
    protected _outgoing: StreamInterface<T> = new Stream<T>();

    public get deferred(): Promise<T> {
        return this._deferred;
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

    constructor(deferredFactory: (executor: Executor<T>) => Promise<T>) {
        this._cancelled = new Deferred<boolean>();

        const deferred: Promise<T> = deferredFactory(this);

        if (false === deferred instanceof Promise) {
            throw new Error("Executor factory must return async.");
        }

        this._deferred = deferred.then(
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

    public complete(): this {
        this._cancelled.resolve();
        this._incoming.complete();
        this._outgoing.complete();

        return this;
    }

    public subscribeExecutor(executor: Executor<T>): this {
        this.subscribeIncomingToStream(executor.incoming).subscribeStreamToOutgoing(executor.outgoing);

        return this;
    }

    public subscribeIncomingToStream(stream: StreamInterface<T>): this {
        stream.subscribeStream(this._incoming);

        return this;
    }

    public subscribeStreamToOutgoing(stream: StreamInterface<T>): this {
        this._outgoing.subscribeStream(stream);

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

}
