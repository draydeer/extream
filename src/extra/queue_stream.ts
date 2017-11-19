import {Stream} from "../stream";

export class QueueStream<T> extends Stream<T> {

    protected _queue: T[] = [];

    public emit(data: T): this {
        this.append(data);

        return this;
    }

    public append(data: T): this {
        this._queue.push(data);

        return this;
    }

}
