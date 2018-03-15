/// <reference types="node" />
/// <reference types="es6-shim" />
export interface BufferInterface<T> extends Iterator<T> {
    readonly current: T;
    readonly isEmpty: boolean;
    add(data: T): this;
    flush(): this;
    next(): IteratorResult<T>;
    shift(): T;
}
