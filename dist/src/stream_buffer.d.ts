export declare class StreamBuffer<T> {
    protected _buffer: T[];
    protected _maxLength: number;
    constructor(maxLength?: number);
    readonly isMaxReached: boolean;
    readonly buffer: T[];
    push(data: T): boolean;
    flush(): this;
}
