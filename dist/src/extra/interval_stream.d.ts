import { Stream } from "../stream";
import { SubscriberInterface } from '../interfaces/subscriber_interface';
export declare class IntervalStream<T> extends Stream<number | T> {
    protected _seconds: number;
    protected _interval: any;
    protected _ticks: number;
    constructor(_seconds: number);
    readonly ticks: number;
    cold(): this;
    complete(): this;
    protected _tickEmit(): void;
    protected _tickStart(): void;
    protected _tickStop(): void;
    protected onSubscriberAdd(subscriber: SubscriberInterface<number | T>): SubscriberInterface<number | T>;
    protected onSubscriberRemove(subscriber: SubscriberInterface<number | T>): SubscriberInterface<number | T>;
}
