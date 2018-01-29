import {Stream} from "../stream";

export class MathStream extends Stream<number> {

    public constructor(protected _accumulator: number = 0) {
        super();
    }

    public get compatible(): this {
        return new MathStream() as this;
    }

    public abs(): this {
        return this._middlewareAdd((data: number) => Math.abs(data));
    }

    public average(): this {
        return this._middlewareAdd((data: number) => data / (this._transmittedCount + 1));
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

    public reduce(reducer: (accumulator: number, data: number, count?: number) => number): this {
        let accumulator = this._accumulator;

        return this._middlewareAdd((data: number) => {
            accumulator = reducer(accumulator, data, this._transmittedCount + 1);

            return this._accumulator;
        });
    }

    public mul(): this {
        let accumulator = this._accumulator || 1;

        return this._middlewareAdd((data: number) => {
            accumulator *= data;

            return accumulator;
        });
    }

    public sqrt(): this {
        return this._middlewareAdd((data: number) => Math.sqrt(data));
    }

    public sum(): this {
        let accumulator = this._accumulator;

        return this._middlewareAdd((data: number) => {
            accumulator += data;

            return accumulator;
        });
    }

}
