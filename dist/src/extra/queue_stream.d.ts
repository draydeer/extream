import { Stream } from "../stream";
export declare class QueueStream<T> extends Stream<T> {
    protected _queue: T[];
    emit(data: T): this;
    append(data: T): this;
    protected _emitQueue(): void;
}
