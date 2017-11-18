import {Agent} from "./agent";
import {CANCELLED} from "./const";
import {Stream} from "./stream";
import {StreamInterface} from "./interfaces/stream_interface";

export class Executor<T> extends Stream<T> {

    protected _agent: Agent<T>;
    protected _async: (agent: Agent<T>) => Promise<T>;
    protected _error: any;
    protected _incomingStream: StreamInterface<T> = new Stream<any>();
    protected _promise: Promise<T>;
    protected _result: T;

    constructor(async: (agent: Agent<T>) => Promise<T>) {
        super();

        this._agent = new Agent<T>(this);
        this._async = async;
    }

    public get incoming(): StreamInterface<T> {
        return this._incomingStream;
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

    public cancel(): this {
        this._incomingStream.error(CANCELLED);

        return this;
    }

    //public complete(): this {
    //    this._incomingStream.complete();
    //
    //    return this;
    //}

    public emit(data: T): this {
        this._incomingStream.emit(data);

        return this;
    }

    public error(error: any): this {
        this._incomingStream.emit(error);

        return this;
    }

    public run(): this {
        if (this._promise) {
            return this;
        }

        this._promise = this._async(this._agent).then<T>((result: T) => {
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

}
