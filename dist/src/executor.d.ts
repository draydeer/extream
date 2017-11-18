import { Agent } from "./agent";
import { Stream } from "./stream";
import { StreamInterface } from "./interfaces/stream_interface";
export declare class Executor<T> extends Stream<T> {
    protected _agent: Agent<T>;
    protected _async: (agent: Agent<T>) => Promise<T>;
    protected _error: any;
    protected _incomingStream: StreamInterface<T>;
    protected _promise: Promise<T>;
    protected _result: T;
    constructor(async: (agent: Agent<T>) => Promise<T>);
    readonly incoming: StreamInterface<T>;
    readonly result: T;
    readonly promise: Promise<T>;
    cancel(): this;
    emit(data: T): this;
    error(error: any): this;
    run(): this;
}
