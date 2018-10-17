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
        this._id = String(ID += 1);
        this._onComplete = onComplete;
        this._onError = onError;
        this._onData = onData;
        this._stream = stream;
    }

    public get id() {
        return this._id;
    }

    public get isShared() {
        return false;
    }

    public get stream(): StreamInterface<T> {
        return this._stream;
    }

    public complete(): this {
        this._stream.root.complete([this]);

        return this;
    }

    public emit(data: T): this {
        this._stream.root.emit(data, [this]);

        return this;
    }

    public error(error: any): this {
        this._stream.root.error(error, [this]);

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

    // middlewares

    public once(): this {
        this._middleware = this.unsubscribe.bind(this);

        return this;
    }

    // handlers

    public doComplete(subscribers?: SubscriberInterface<T>[]): this {
        this._processMiddleware();

        if (this._onComplete) {
            this._onComplete(subscribers);
        }

        return this.unsubscribe();
    }

    public doData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        data = this._processMiddleware(data);

        if (this._onData) {
            this._onData(data, subscribers);
        }

        return this;
    }

    public doError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        this._processMiddleware(error);

        if (this._onError) {
            this._onError(error, subscribers);
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
    protected _middleware;
    protected _onComplete: OnComplete<T>;
    protected _onData: OnData<T>;
    protected _onError: OnError<T>;
    protected _stream: StreamInterface<T>;
    protected _tag: string;

    constructor(stream: StreamInterface<T>, onData?: OnData<T>, onError?: OnError<T>, onComplete?: OnComplete<T>) {
        this._onComplete = onComplete;
        this._onData = onData;
        this._onError = onError;

        this._id = String(ID += 1);
        this._stream = stream;
    }

    public get id() {
        return this._id;
    }

    public get isShared() {
        return true;
    }

    public get stream(): StreamInterface<T> {
        return this._stream;
    }

    public get tag(): string {
        return this._tag;
    }

    public setTag(tag: string): this {
        this._tag = tag;

        return this;
    }

    public complete(): this {
        this._stream.root.complete([this]);

        return this;
    }

    public emit(data: T): this {
        this._stream.root.emit(data, [this]);

        return this;
    }

    public error(error: any): this {
        this._stream.root.error(error, [this]);

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
        this._onComplete(subscribers);

        return this.unsubscribe();
    }

    public doData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        this._onData(data, subscribers);

        return this;
    }

    public doError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        this._onError(error, subscribers);

        return this;
    }

}