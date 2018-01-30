import { Stream } from "../stream";
export declare class MathStream extends Stream<number> {
    protected _accumulator: number;
    constructor(_accumulator?: number);
    readonly compatible: this;
    abs(): this;
    average(): this;
    ceil(): this;
    cos(): this;
    floor(): this;
    log(): this;
    max(): this;
    min(): this;
    reduce(reducer: (accumulator: number, data: number, count?: number) => number): this;
    mul(): this;
    round(): this;
    sin(): this;
    sqrt(): this;
    sum(): this;
}
