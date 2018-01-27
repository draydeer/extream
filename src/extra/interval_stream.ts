import {StreamInterface} from "../interfaces/stream_interface";
import {Stream} from "../stream";

export class IntervalStream<T> extends Stream<number|T> {

    protected _interval;
    protected _ticks: number = 0;

    public constructor(seconds: number) {
        super();

        this._interval = setInterval(() => super.emit(this._ticks ++), seconds * 1000);
    }

    public get ticks(): number {
        return this._ticks;
    }

    public complete(): this {
        clearInterval(this._interval);

        return super.complete();
    }

}
