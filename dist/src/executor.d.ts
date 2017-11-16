import { Stream } from "./stream";
import { StreamInterface } from "./interfaces/stream_interface";
export declare class Executor<T> extends Stream<T> {
    protected _agent: Agent<T>;
    protected _async: (agent: Agent<T>) => Promise<T>;
    protected _error: any;
    protected _incomingStream: Stream<any>;
    protected _promise: Promise<T>;
    protected _result: T;
    constructor(async: (agent: Agent<T>) => Promise<T>);
    readonly result: T;
    readonly promise: Promise<T>;
    cancel(): this;
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    run(): this;
}
export declare class Agent<T> {
    protected _emit: (data: T) => Executor<T>;
    protected _executor: Executor<T>;
    protected _incomingStream: StreamInterface<any>;
    constructor(executor: Executor<T>, emit: (data: T) => Executor<T>, incomingStream: StreamInterface<any>);
    readonly incoming: StreamInterface<T>;
    readonly incomingStream: StreamInterface<T>;
    emit(data: T): this;
}
