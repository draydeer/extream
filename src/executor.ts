import {Delegate} from "./delegate";
import {CANCELLED, COMPLETED} from "./const";
import {Stream} from "./stream";
import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {OnData, OnError} from "./types";

export class Executor<T> extends Stream<T> implements Promise<T> {

    protected _async: (agent: Delegate<T>) => Promise<T>;
    protected _delegate: Delegate<T>;
    protected _error: any;
    protected _incomingStream: StreamInterface<T> = new Stream<T>().progressive();
    protected _promise: Promise<T>;
    protected _result: T;

    constructor(async: (delegate: Delegate<T>) => Promise<T>) {
        super();

        this._async = async;
        this._delegate = new Delegate<T>(this);
    }

    public get incoming(): StreamInterface<T> {
        return this._incomingStream;
    }

    public get isRunning(): boolean {
        return !! this._promise;
    }

    public get result(): T {
        return this._result;
    }

    public get promise(): Promise<T> {
        if (this._promise) {
            return this._promise;
        }

        this.run();

        return this._promise;
    }

    public complete(): this {
        this._incomingStream.error(COMPLETED);

        return super.complete();
    }

    public emit(data: T): this {
        this._incomingStream.emit(data);

        return this;
    }

    public error(error: any): this {
        this._incomingStream.error(error);

        return this;
    }

    public pipeOutgoingTo(...streams: StreamInterface<T>[]): this {
        streams.forEach((stream) => this.subscribeStream(stream));

        return this;
    }

    public pipeToIncoming(...streams: StreamInterface<T>[]): this {
        streams.forEach((stream) => stream.subscribeStream(this._incomingStream));

        return this;
    }

    public run(): this {
        if (this._promise) {
            return this;
        }

        this._promise = this._async(this._delegate).then<T>((result: T) => {
            this._promise = void 0;
            this._result = result;

            super.emit(result);

            return result;
        }).catch((error: any) => {
            this._promise = void 0;
            this._error = error;

            super.error(error);

            throw error;
        });

        return this;
    }

    // promise like

    public catch(onrejected?: OnError<T>): Promise<T> {
        return this.promise.catch(onrejected);
    }

    public then(onfulfilled?: OnData<T>): Promise<T> {
        return this.promise.then(onfulfilled);
    }

}
