import {Executor} from "./executor";
import {Stream} from "./stream";
import {StreamInterface} from "./interfaces/stream_interface";

export class Agent<T> {

    protected _executor: Executor<T>;

    constructor(executor: Executor<T>) {
        this._executor = executor;
    }

    // public all(...asyncs: (Promise<T>|StreamInterface<T>)[]): Promise<T[]> {
    //
    // }

    public emit(data: T): this {
        Stream.prototype.emit.call(this._executor, data);

        return this;
    }

    public race(...asyncs: (Promise<T>|StreamInterface<T>)[]): Promise<T> {
        asyncs.push(this._executor.incoming);

        return Stream.merge(...asyncs).first().toPromise();
    }

}
