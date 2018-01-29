import { Stream } from "../stream";
export declare class MathStream extends Stream<number> {
    protected _accumulator: number;
    constructor(_accumulator?: number);
    readonly compatible: this;
    abs(): this;
    average(): this;
    max(): this;
    min(): this;
    reduce(reducer: (accumulator: number, data: number, count?: number) => number): this;
    mul(): this;
    sqrt(): this;
    sum(): this;
}
