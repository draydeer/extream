import { Delegate } from "./delegate";
import { Stream } from "./stream";
import { StreamInterface } from "./interfaces/stream_interface";
export declare class Executor<T> extends Stream<T> implements Promise<T> {
    protected _async: (agent: Delegate<T>) => Promise<T>;
    protected _delegate: Delegate<T>;
    protected _error: any;
    protected _incomingStream: StreamInterface<T>;
    protected _promise: Promise<T>;
    protected _result: T;
    constructor(async: (delegate: Delegate<T>) => Promise<T>);
    readonly incoming: StreamInterface<T>;
    readonly isRunning: boolean;
    readonly result: T;
    readonly promise: Promise<T>;
    complete(): this;
    emit(data: T): this;
    error(error: any): this;
    pipeOutgoingTo(...streams: StreamInterface<T>[]): this;
    pipeToIncoming(...streams: StreamInterface<T>[]): this;
    run(): this;
    catch(onrejected?: (error) => any): Promise<T>;
    then(onfulfilled?: (data: T) => any): Promise<T>;
}
