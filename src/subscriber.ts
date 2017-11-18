import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {StreamInterface} from "./interfaces/stream_interface";

let ID = 10000000;

/**
 * Subscriber.
 */
export class Subscriber<T> implements SubscriberInterface<T> {

    protected _id: string;
    protected _middleware;
    protected _onComplete: () => any;
    protected _onData: (value: T) => any;
    protected _onError: (error: any) => any;
    protected _stream: StreamInterface<T>;

    public get id() {
        return this._id;
    }

    public get stream(): StreamInterface<T> {
        return this._stream;
    }

    constructor(
        stream: StreamInterface<T>,
        onData?: (data: T) => any,
        onError?: (error: any) => any,
        onComplete?: () => any
    ) {
        this._id = String(ID ++);
        this._onComplete = onComplete;
        this._onError = onError;
        this._onData = onData;
        this._stream = stream;
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

    public doComplete(): this {
        this._processMiddleware();

        if (this._onComplete) {
            this._onComplete();
        }

        return this.unsubscribe();
    }

    public doData(data: T): this {
        data = this._processMiddleware(data);

        if (this._onData) {
            this._onData(data);
        }

        return this;
    }

    public doError(error: any): this {
        this._processMiddleware(error);

        if (this._onError) {
            this._onError(error);
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
