import {Stream} from "../stream";

export class MathStream extends Stream<number> {

    protected _max: number;
    protected _min: number;

    public constructor(protected _accumulator: number = 0) {
        super();
    }

    public get clone(): this {
        return new MathStream() as this;
    }

    public abs(): this {
        return this._middlewareAdd((data: number) => Math.abs(data));
    }

    public average(): this {
        return this._middlewareAdd((data: number) => data / (this._transmittedCount + 1));
    }

    public max(): this {
        return this._middlewareAdd((data: number) => {
            this._max = this._max === void 0 ? data : (this._max > data ? this._max : data);

            return this._max;
        });
    }

    public min(): this {
        return this._middlewareAdd((data: number) => {
            this._min = this._min === void 0 ? data : (this._min < data ? this._min : data);

            return this._min;
        });
    }

    public reduce(reducer: (accumulator: number, data: number, count?: number) => number): this {
        return this._middlewareAdd((data: number) => {
            this._accumulator = reducer(this._accumulator, data, this._transmittedCount + 1);

            return this._accumulator;
        });
    }

    public mul(): this {
        return this._middlewareAdd((data: number) => this._accumulator = (this._accumulator || 1) * data);
    }

    public sqrt(): this {
        return this._middlewareAdd((data: number) => Math.sqrt(data));
    }

    public sum(): this {
        return this._middlewareAdd((data: number) => this._accumulator += data);
    }

}
