import { Executor } from "./executor";
import { StreamInterface } from "./interfaces/stream_interface";
export declare class Delegate<T> {
    protected _executor: Executor<T>;
    constructor(executor: Executor<T>);
    emit(data: T): this;
    race(...asyncs: (Promise<T> | StreamInterface<T>)[]): StreamInterface<T>;
}
