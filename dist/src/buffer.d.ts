/// <reference types="es6-shim" />
/// <reference types="node" />
import { BufferInterface } from "./interfaces/buffer_interface";
export declare class CyclicBuffer<T> implements BufferInterface<T> {
    protected _size: number;
    protected _preallocate: boolean;
    protected _buffer: T[];
    protected _headIndex: number;
    protected _tailIndex: number;
    constructor(_size?: number, _preallocate?: boolean);
    readonly current: T;
    readonly isEmpty: boolean;
    add(data: T): this;
    flush(): this;
    next(): IteratorResult<T>;
    shift(): T;
}
