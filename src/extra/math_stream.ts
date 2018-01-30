import {Stream} from "../stream";

export class MathStream extends Stream<number> {

    public constructor(protected _accumulator: number = 0) {
        super();
    }

    public get compatible(): this {
        return new MathStream() as this;
    }

    public abs(): this {
        return this._middlewareAdd(Math.abs);
    }

    public average(): this {
        return this._middlewareAdd((data: number) => data / (this._transmittedCount + 1));
    }

    public ceil(): this {
        return this._middlewareAdd(Math.ceil);
    }

    public cos(): this {
        return this._middlewareAdd(Math.cos);
    }

    public floor(): this {
        return this._middlewareAdd(Math.floor);
    }

    public log(): this {
        return this._middlewareAdd(Math.log);
    }

    public max(): this {
        let max;

        return this._middlewareAdd((data: number) => {
            max = max === void 0 ? data : (max > data ? max : data);

            return max;
        });
    }

    public min(): this {
        let min;

        return this._middlewareAdd((data: number) => {
            min = min === void 0 ? data : (min < data ? min : data);

            return min;
        });
    }

    public mul(accumulator?: number): this {
        accumulator = accumulator || this._accumulator || 1;

        return this._middlewareAdd((data: number) => {
            accumulator *= data;

            return accumulator;
        });
    }

    public round(): this {
        return this._middlewareAdd(Math.round);
    }

    public sin(): this {
        return this._middlewareAdd(Math.sin);
    }

    public sqrt(): this {
        return this._middlewareAdd(Math.sqrt);
    }

    public sum(accumulator?: number): this {
        accumulator = accumulator || this._accumulator || 0;

        return this._middlewareAdd((data: number) => {
            accumulator += data;

            return accumulator;
        });
    }

}
