import { Stream } from "../stream";
export declare class MathStream extends Stream<number> {
    protected _accumulator: number;
    constructor(_accumulator?: number);
    getCompatible(): this;
    abs(): this;
    average(): this;
    ceil(): this;
    cos(): this;
    floor(): this;
    log(): this;
    max(): this;
    min(): this;
    mul(accumulator?: number): this;
    round(): this;
    sin(): this;
    sqrt(): this;
    sum(accumulator?: number): this;
}
