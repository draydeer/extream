import {Stream} from "../stream";
import {StreamInterface} from "../interfaces/stream_interface";

export class FetchStream<T> extends Stream<T> {

    protected _queue: T[] = [];

    public emit(data: T): this {
        return this;
    }

    public delete(url: string): StreamInterface<T> {
        return this.fork();
    }

    public get(url: string): StreamInterface<T> {
        return this.fork();
    }

    public post(url: string): StreamInterface<T> {
        return this.fork();
    }

    public put(url: string): StreamInterface<T> {
        return this.fork();
    }

}
