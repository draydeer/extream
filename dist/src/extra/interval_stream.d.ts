import { Stream } from "../stream";
export declare class IntervalStream<T> extends Stream<T> {
    protected _interval: any;
    constructor(seconds: number, ...args: any[]);
    complete(): this;
}
