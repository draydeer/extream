import { Stream } from "../stream";
export declare class MathStream extends Stream<number> {
    protected _accumulator: number;
    protected _max: number;
    protected _min: number;
    constructor(_accumulator?: number);
    readonly clone: this;
    abs(): this;
    average(): this;
    max(): this;
    min(): this;
    reduce(reducer: (accumulator: number, data: number, count?: number) => number): this;
    mul(): this;
    sqrt(): this;
    sum(): this;
}