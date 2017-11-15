import {Stream} from "./stream";

export class Executor<T> extends Stream<T> {

    protected _async: (executor: Executor<T>) => Promise<T>;
    protected _incomingStream = new Stream();
    protected _promise: Promise<T>;

    constructor(async: (executor: Executor<T>) => Promise<T>) {
        super();

        this._async = async;
    }

    public get promise(): Promise<T> {
        if (this._promise) {
            return this._promise;
        }

        this.run();

        return this._promise;
    }

    public cancel(): this {
        this._incomingStream.error(null);

        return this;
    }

    public emit(data: T): this {
        return this;
    }

    public run(): this {
        if (this._promise) {
            return this;
        }

        this._promise = this._async(this);

        return this;
    }

}
