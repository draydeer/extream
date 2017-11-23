import { Agent } from "./agent";
import { Stream } from "./stream";
import { StreamInterface } from "./interfaces/stream_interface";
import { OnData, OnError } from "./types";
export declare class Executor<T> extends Stream<T> implements Promise<T> {
    protected _agent: Agent<T>;
    protected _async: (agent: Agent<T>) => Promise<T>;
    protected _error: any;
    protected _incomingStream: StreamInterface<T>;
    protected _promise: Promise<T>;
    protected _result: T;
    constructor(async: (agent: Agent<T>) => Promise<T>);
    readonly incoming: StreamInterface<T>;
    readonly isRunning: boolean;
    readonly result: T;
    readonly promise: Promise<T>;
    catch(onError?: OnError): Promise<T>;
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    pipeToIncoming(...streams: StreamInterface<T>[]): this;
    pipeOutgoingTo(...streams: StreamInterface<T>[]): this;
    run(): this;
    then(onFulfilled?: OnData<T>): Promise<T>;
}
