/// <reference types="es6-shim" />
/// <reference types="node" />
export declare class StreamBuffer<T> implements Iterator<T> {
    protected _buffer: T[];
    protected _headIndex: number;
    protected _size: number;
    protected _tailIndex: number;
    constructor(size?: number, preallocate?: boolean);
    readonly isEmpty: boolean;
    next(): IteratorResult<T>;
    flush(): this;
    add(data: T): this;
    shift(): T;
}
