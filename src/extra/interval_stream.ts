import {Stream} from "../stream";
import {SubscriberInterface} from '../interfaces/subscriber_interface';

export class IntervalStream<T> extends Stream<number|T> {

    protected _interval;
    protected _ticks: number = 0;

    public constructor(protected _seconds: number) {
        super();
    }

    public get ticks(): number {
        return this._ticks;
    }

    public cold(): this {
        this._tickStart();

        return this;
    }

    public complete(): this {
        this._tickStop();

        return super.complete();
    }

    protected _tickEmit() {
        this._ticks += 1;

        super.emit(this._ticks);
    }

    protected _tickStart() {
        if (! this._interval) {
            this._interval = setInterval(() => {
                this._tickEmit();
            }, this._seconds * 1000);
        }
    }

    protected _tickStop() {
        if (this._interval) {
            clearInterval(this._interval);

            this._interval = void 0;
        }
    }

    protected onSubscriberAdd(subscriber: SubscriberInterface<number|T>): SubscriberInterface<number|T> {
        if (! this._isCold) {
            this._tickStart();
        }

        return super.onSubscriberAdd(subscriber);
    }

    protected onSubscriberRemove(subscriber: SubscriberInterface<number|T>): SubscriberInterface<number|T> {
        if (! this._isCold && this.subscribersCount === 0) {
            this._tickStop();
        }

        return super.onSubscriberRemove(subscriber);
    }

}
