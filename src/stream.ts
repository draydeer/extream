import {CANCELLED, COMPLETED} from "./const";
import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {StreamBuffer} from "./stream_buffer";
import {Subscriber} from "./subscriber";
import {PrimitiveType} from "./types";

/**
 * Stream.
 */
export class Stream<T> implements StreamInterface<T> {

    protected _emitBuffer: StreamBuffer<T>;
    protected _isPaused: boolean;
    protected _lastValue: T;
    protected _middlewares: ((data: T, stream?: Stream<T>) => T | Promise<T> | Error)[] = [];
    protected _subscribeBuffer: StreamBuffer<T>;
    protected _subscribers: {[key: string]: SubscriberInterface<T>} = {};
    protected _transmittedCount: number = 0;

    public static fromPromise(promise: Promise<T>): StreamInterface<T> {
        const stream = new this();

        promise.then(stream.emitAndComplete.bind(stream)).catch(stream.error.bind(stream));

        return stream;
    }

    public static merge(asyncs: (Promise<T>|StreamInterface<T>)[]): StreamInterface<T> {

    }

    public static get COMPLETED(): Error {
        return COMPLETED;
    };

    public constructor() {

    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get lastValue(): T {
        return this._lastValue;
    }

    public get subscribersCount(): number {
        return 0;
    }

    public get transmittedCount(): number {
        return this._transmittedCount;
    }

    public complete(): this {
        this._complete();

        return this;
    }

    public emit(data: T): this {
        this._emit(data);

        return this;
    }

    public emitAndComplete(data: T): this {
        this._emit(data).then(this.complete.bind(this));

        return this;
    }

    public error(error: any): this {
        this._subscriberOnError(error);

        return this;
    }

    public initEmitBuffer(maxLength: number = 0) {
        this._emitBuffer = this._emitBuffer || new StreamBuffer(maxLength);

        return this;
    }

    public initSubscribeBuffer(maxLength: number = 0) {
        this._subscribeBuffer = this._subscribeBuffer || new StreamBuffer(maxLength);

        return this;
    }

    public pause(): this {
        this._isPaused = true;

        return this;
    }

    public resume(): this {
        this._isPaused = false;

        return this;
    }

    public subscribe(
        onData?: (data: T) => any,
        onError?: (error: any) => any,
        onComplete?: () => any
    ): SubscriberInterface<T> {
        return this._subscriberAdd(new Subscriber<T>(this, onData, onError, onComplete));
    }

    public subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T> {
        return this.subscribe(stream.emit.bind(stream), stream.error.bind(stream), stream.complete.bind(stream));
    }

    public unsubscribe(subscriber: SubscriberInterface<T>): this {
        return this._subscriberRemove(subscriber);
    }

    // middlewares

    public delay(milliseconds: number): this {
        this._middlewares.push(
            (data) => new Promise<T>((resolve) => setTimeout(() => resolve(data), milliseconds))
        );

        return this;
    }

    public exec(middleware: T | Promise<T> | ((data: T, stream?: Stream<T>) => T | Promise<T>)): this {
        //this._middlewares.push(
        //    middleware instanceof Promise
        //        ? (data, stream) => middleware
        //        :
        //);

        return this;
    }

    public filter(middleware: T|((data: T, stream?: Stream<T>) => boolean)): this {
        this._middlewares.push(
            middleware instanceof Function
                ? (data, stream) => middleware(data, stream) ? data : CANCELLED
                : (data, stream) => middleware === data ? data : CANCELLED
        );

        return this;
    }

    public first(middleware: ((data: T, stream?: Stream<T>) => T | Promise<T>)): this {
        let isFirst: boolean = true;

        this._middlewares.push((data: T, stream?: Stream<T>) => {
            if (isFirst) {
                isFirst = false;

                return middleware(data, stream);
            } else {
                return data;
            }
        });

        return this;
    }

    public fork(): StreamInterface<T> {
        let stream: Stream<T> = new Stream<T>();

        this.subscribeStream(stream);

        return stream;
    }

    public map(middleware: (data: T, stream?: Stream<T>) => T | Promise<T>): this {
        this._middlewares.push(
            middleware
        );

        return this;
    }

    public toPromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(
                resolve, reject, () => reject(COMPLETED)
            ).once();
        });
    }

    public toOnCompletePromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(
                void 0, reject, () => resolve(this._lastValue)
            );
        });
    }

    protected _complete(): this {
        this._subscriberOnComplete();

        this._emitBuffer = this._lastValue = this._subscribeBuffer = void 0;

        return this;
    }

    protected async _emit(data: T) {
        if (this._isPaused) {
            return;
        }

        let temp: T | Promise<T> | Error = data;

        for (const middleware of this._middlewares) {
            temp = await middleware(<T>temp, this);

            if (temp === CANCELLED) {
                return;
            }
        }

        this._lastValue = <T>temp;

        this._transmittedCount ++;

        this._subscriberOnData(<T>temp);

        return temp;
    }

    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T> {
        if (false === subscriber.id in this._subscribers) {
            this._subscribers[subscriber.id] = subscriber;
        }

        return subscriber;
    }

    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this {
        if (subscriber.id in this._subscribers) {
            delete this._subscribers[subscriber.unsubscribe().id];
        }

        return this;
    }

    protected _subscriberOnComplete(): this {
        for (const subscriberId of (<any>Object).keys(this._subscribers)) {
            this._subscribers[subscriberId].doComplete();
        }

        return this;
    }

    protected _subscriberOnData(data: T): this {
        for (const subscriberId of (<any>Object).keys(this._subscribers)) {
            this._subscribers[subscriberId].doData(data);
        }

        return this;
    }

    protected _subscriberOnError(error: any): this {
        for (const subscriberId of (<any>Object).keys(this._subscribers)) {
            this._subscribers[subscriberId].doError(error);
        }

        return this;
    }

}
