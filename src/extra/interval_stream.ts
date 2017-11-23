import {Stream} from "../stream";

export class IntervalStream<T> extends Stream<T> {

    protected _interval;

    public constructor(seconds: number, ...args: any[]) {
        super();

        this._interval = setInterval(this.emit.bind(this), seconds * 1000, ...args);
    }

    public complete(): this {
        clearInterval(this._interval);

        return super.complete();
    }

}
