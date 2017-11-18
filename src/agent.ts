import {Executor} from "./executor";
import {Stream} from "./stream";
import {StreamInterface} from "./interfaces/stream_interface";

export class Agent<T> {

    protected _executor: Executor<T>;

    constructor(executor: Executor<T>) {
        this._executor = executor;
    }

    public emit(data: T): this {
        Stream.prototype.emit.call(this._executor, data);

        return this;
    }

    public race(...asyncs: (Promise<T>|StreamInterface<T>)[]): StreamInterface<T> {
        const stream = Stream.merge(...asyncs);

        return stream;
    }

}
