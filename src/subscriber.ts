import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {OnComplete, OnData, OnError} from "./types";

let ID = 10000000;

/**
 * Subscriber.
 */
export class Subscriber<T> implements SubscriberInterface<T> {

    protected _id: string;
    protected _middleware;
    protected _onComplete: OnComplete<T>;
    protected _onData: OnData<T>;
    protected _onError: OnError<T>;
    protected _stream: StreamInterface<T>;

    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>) {
        this._id = String(ID ++);
        this._onComplete = onComplete;
        this._onError = onError;
        this._onData = onData;
        this._stream = stream;
    }

    public get id() {
        return this._id;
    }

    public get stream(): StreamInterface<T> {
        return this._stream;
    }

    public unsubscribe(): this {
        if (this._stream) {
            const stream = this._stream;

            this._middleware = this._stream = null;

            stream.unsubscribe(this);
        }

        return this;
    }

    // middlewares

    public once(): this {
        this._middleware = this.unsubscribe.bind(this);

        return this;
    }

    // handlers

    public doComplete(subscribers?: SubscriberInterface<T>[]): this {
        this._processMiddleware();

        if (this._onComplete) {
            this._onComplete(this._stream, subscribers);
        }

        return this.unsubscribe();
    }

    public doData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        data = this._processMiddleware(data);

        if (this._onData) {
            this._onData(data, this._stream, subscribers);
        }

        return this;
    }

    public doError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        this._processMiddleware(error);

        if (this._onError) {
            this._onError(this._stream, error, subscribers);
        }

        return this;
    }

    protected _processMiddleware(data?: T): T {
        if (this._middleware) {
            this._middleware();
        }

        return data;
    }

}

/**
 * Subscriber.
 */
export class UnsafeSubscriber<T> implements SubscriberInterface<T> {

    protected _id: string;
    protected _isIsolated: boolean;
    protected _middleware;
    protected _onComplete: OnComplete<T>;
    protected _onData: OnData<T>;
    protected _onError: OnError<T>;
    protected _stream: StreamInterface<T>;

    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>) {
        this._onComplete = onComplete;
        this._onData = onData;
        this._onError = onError;

        this._id = String(ID ++);
        this._stream = stream;
    }

    public get id() {
        return this._id;
    }

    public get isIsolated() {
        return true;
    }

    public get stream(): StreamInterface<T> {
        return this._stream;
    }

    public isolated(): this {
        this._isIsolated = true;

        return this;
    }

    public unsubscribe(): this {
        if (this._stream) {
            const stream = this._stream;

            this._middleware = this._stream = null;

            stream.unsubscribe(this);
        }

        return this;
    }

    public once(): this {
        return this;
    }

    public doComplete(subscribers?: SubscriberInterface<T>[]): this {
        this._onComplete(this._stream, subscribers);

        return this.unsubscribe();
    }

    public doData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        this._onData(data, this._stream, subscribers);

        return this;
    }

    public doError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        this._onError(error, this._stream, subscribers);

        return this;
    }

}