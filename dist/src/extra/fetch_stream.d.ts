import { Stream } from "../stream";
import { StreamInterface } from "../interfaces/stream_interface";
export declare class FetchStream<T> extends Stream<T> {
    protected _queue: T[];
    emit(data: T): this;
    delete(url: string): StreamInterface<T>;
    get(url: string): StreamInterface<T>;
    post(url: string): StreamInterface<T>;
    put(url: string): StreamInterface<T>;
}
