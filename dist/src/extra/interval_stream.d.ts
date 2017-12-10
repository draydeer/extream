import { Stream } from "../stream";
export declare class IntervalStream<T> extends Stream<number | T> {
    protected _interval: any;
    protected _ticks: number;
    constructor(seconds: number);
    readonly ticks: number;
    complete(): this;
}
