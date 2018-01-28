import {CANCELLED, COMPLETED} from "./const";
import {BufferInterface} from "./interfaces/buffer_interface";
import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {CyclicBuffer} from "./buffer";
import {Subscriber} from "./subscriber";
import {StreamMiddleware, OnComplete, OnData, OnError} from "./types";

/**
 * Stream.
 */
export class Stream<T> implements StreamInterface<T> {

    protected _emitLoopPromise: Promise<T>;
    protected _isEmptyLastValue: boolean;
    protected _isComplex: boolean;
    protected _isPaused: boolean;
    protected _isProcessing: boolean;
    protected _lastValue: T;
    protected _middlewares: StreamMiddleware<T>[];
    protected _middlewaresAfterDispatch: StreamMiddleware<T>[];
    protected _postbuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _prebuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _root: StreamInterface<T>;
    protected _subscribers: {[key: string]: SubscriberInterface<T>} = {};
    protected _subscribersCount: number = 0;
    protected _transmittedCount: number = 0;

    public static get COMPLETED(): Error {
        return COMPLETED;
    };

    public static fromPromise<T>(promise: Promise<T>): StreamInterface<T> {
        const stream: StreamInterface<T> = new Stream<T>();

        promise.then(
            stream.emitAndComplete.bind(stream)
        ).catch(
            stream.error.bind(stream)
        );

        return stream;
    }

    public static merge<T>(...asyncs: (Promise<T>|StreamInterface<T>)[]): StreamInterface<T> {
        const stream: StreamInterface<T> = new Stream<T>();

        asyncs.forEach((async) => {
            const mixedStream: StreamInterface<T> = async instanceof Promise ? Stream.fromPromise(async) : async;

            mixedStream.subscribeStream(stream);
        });

        return stream;
    }

    public constructor() {

    }

    public get clone(): this {
        return new Stream<T>() as this;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get lastValue(): T {
        return this._lastValue;
    }
    
    public get root(): this {
        return this._root as this || this;
    }

    public get subscribersCount(): number {
        return this._subscribersCount;
    }

    public get transmittedCount(): number {
        return this._transmittedCount;
    }

    public setRoot(stream: StreamInterface<T>): this {
        if (stream !== this) {
            this._root = stream;
        }

        return this;
    }

    public complete(): this {
        this._complete();

        return this;
    }

    public complex(): this {
        this._isComplex = true;

        return this;
    }

    public emit(data: T, subscribers?: SubscriberInterface<T>[]): this {
        this._emit(data, subscribers);

        return this;
    }

    public emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this {
        //this._emit(data, subscribers).then(this.complete.bind(this));

        return this;
    }

    public error(error: any): this {
        this._subscriberOnError(error);

        return this;
    }

    public fork(): this {
        let stream = this.clone;

        this.subscribeStream(stream);

        return stream.setRoot(this.root);
    }

    public emptyLastValue(): this {
        this._isEmptyLastValue = true;

        return this;
    }

    public pause(): this {
        this._isPaused = true;

        return this;
    }

    public postbuffer(size: number = 10): this {
        this._postbuffer = new CyclicBuffer(size);

        return this;
    }

    public prebuffer(size: number = 10): this {
        this._prebuffer = new CyclicBuffer(size);

        return this;
    }

    public resume(): this {
        this._isPaused = false;

        return this;
    }

    public simple(): this {
        this._isComplex = false;

        return this;
    }

    public subscribe(onData?: OnData<T>, onError?: OnError, onComplete?: OnComplete): SubscriberInterface<T> {
        return this._subscriberAdd(new Subscriber<T>(this, onData, onError, onComplete));
    }

    public subscribeOnComplete(onComplete?: OnComplete): SubscriberInterface<T> {
        return this._subscriberAdd(new Subscriber<T>(this, void 0, void 0, onComplete));
    }

    public subscribeStream(stream: StreamInterface<T>): SubscriberInterface<T> {
        const subscription = this.subscribe(
            stream.emit.bind(stream),
            stream.error.bind(stream),
            stream.complete.bind(stream)
        );

        stream.subscribeOnComplete(subscription.unsubscribe.bind(subscription));

        return subscription;
    }

    public unsubscribe(subscriber: SubscriberInterface<T>): this {
        return this._subscriberRemove(subscriber);
    }

    // middlewares

    public debug(callback: (data: T, stream?: StreamInterface<T>) => void): this {
        return this._middlewareAdd((data) => {
            callback(data);

            return data;
        });
    }

    public delay(milliseconds: number): this {
        return this._middlewareAdd((data) => new Promise<T>(
            (resolve) => setTimeout(
                () => resolve(data), milliseconds
            )
        ));
    }

    public dispatch(): this {
        return this._middlewareAdd((data) => {
            this._subscriberOnData(data);

            return data;
        });
    }

    public exec(middleware: (data: T, stream?: StreamInterface<T>) => T | Promise<T>): this {
        return this._middlewareAdd((data, stream) => {
            let result = middleware(data, stream);

            return result !== void 0 ? result : data;
        });
    }

    public filter(middleware: T|((data: T, stream?: StreamInterface<T>) => boolean)): this {
        return this._middlewareAdd(
            middleware instanceof Function
                ? (data, stream) => middleware(data, stream) ? data : CANCELLED
                : (data, stream) => middleware === data ? data : CANCELLED
        );
    }

    public first(): this {
        this._middlewareAfterDispatchAdd((data) => {
            this.complete();

            return data;
        });

        return this;
    }

    public map(middleware: (data: T, stream?: StreamInterface<T>) => T | Promise<T>): this {
        return this._middlewareAdd(middleware);
    }

    public select(selector: (data: T) => string, streams: {[key: string]: StreamInterface<T>}): this {
        return this._middlewareAdd((data: T) => {
            const index = selector(data);

            if (index in streams) {
                return new Promise<T>((resolve, reject) => {
                    const subscriber = streams[index].subscribe(
                        resolve,
                        reject,
                        () => reject(CANCELLED)
                    ).isolated().once();

                    streams[index].root.emit(data, [subscriber]);
                });
            }

            throw new Error(`"select" middleware got invalid index from selector: ${index}`);
        });
    }

    public skip(middleware: T|((data: T, stream?: StreamInterface<T>) => boolean)): this {
        return this._middlewareAdd(
            middleware instanceof Function
                ? (data, stream) => middleware(data, stream) ? CANCELLED : data
                : (data, stream) => middleware === data ? CANCELLED : data
        );
    }

    public waitFor(stream: StreamInterface<T>): this {
        return this._middlewareAdd((data: T) => stream.emit(data).toPromise());
    }

    public waitForCompletion(stream: StreamInterface<T>): this {
        return this._middlewareAdd((data: T) => stream.emit(data).toCompletionPromise());
    }

    public waitForError(stream: StreamInterface<T>): this {
        return this._middlewareAdd((data: T) => stream.emit(data).toErrorPromise());
    }

    public toCompletionPromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(void 0, reject, () => resolve(this._lastValue)).once();
        });
    }

    public toErrorPromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(void 0, resolve, () => reject(COMPLETED)).once();
        });
    }

    public toPromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(resolve, reject, () => reject(COMPLETED)).once();
        });
    }

    protected _complete(): this {
        this._subscriberOnComplete();

        return this;
    }

    protected _emit(data: T, subscribers?: SubscriberInterface<T>[]) {
        if (this._prebuffer) {
            if (this._isProcessing) {
                this._prebuffer.add([data, subscribers]);
            } else {
                this._emitLoop(data, subscribers, 0);
            }

            return;
        }

        return this._emitLoop(data, subscribers, 0);
    }

    protected _emitLoop(d, s, i, e?) {
        this._isProcessing = true;

        if (e) {
            this._subscriberOnError(e, s);
        }

        while (true) {
            if (this._middlewares) {
                for (const l = this._middlewares.length; i < l; i ++) {
                    d = this._middlewares[i](d as T, this);

                    if (d instanceof Promise) {
                        d.then(
                            (d) => this._emitLoop(d, s, i + 1),
                            (e) => this._emitLoop(d, s, i + 1, e)
                        );

                        return;
                    }

                    if (d === CANCELLED) {
                        break;
                    }
                }
            }

            if (d !== CANCELLED) {
                this._subscriberOnData(d, s);
            }

            if (! this._prebuffer || this._prebuffer.isEmpty) {
                this._isProcessing = false;

                return;
            }

            i = 0;

            [d, s] = this._prebuffer.next().value;
        }
    }

    protected _emitLoop1(prebuffer) { //: Promise<T> {
        let temp: T | Error | Promise<T>;

        for (let [data, subscribers] of prebuffer) {
            temp = data;

            if (this._isPaused) {
                break;
            }

            try {
                let cancelled = false;

                if (this._middlewares) {
                    for (const middleware of this._middlewares) {
                        temp = middleware(temp as T, this);

                        if (temp instanceof Promise) {
                            //temp = await temp;
                        }

                        if (temp === CANCELLED) {
                            cancelled = true;

                            break;
                        }
                    }
                }

                if (cancelled) {
                    continue;
                }

                this._lastValue = <T>temp;
                this._transmittedCount ++;

                this._subscriberOnData(<T>temp, subscribers);

                if (this._middlewaresAfterDispatch) {
                    for (const middleware of this._middlewaresAfterDispatch) {
                        temp = middleware(temp as T, this);

                        if (temp instanceof Promise) {
                            //temp = await temp;
                        }

                        if (temp === CANCELLED) {
                            cancelled = true;

                            break;
                        }
                    }
                }
            } catch (error) {
                this._subscriberOnError(error);
            }
        }

        this._emitLoopPromise = null;

        return temp as T;
    }

    protected _middlewareAdd(middleware: StreamMiddleware<T>): this {
        if (this._middlewares === void 0) {
            this._middlewares = [];
        }

        this._middlewares.push(middleware);

        return this._isComplex ? this : this.fork();
    }

    protected _middlewareAfterDispatchAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T> {
        if (this._middlewaresAfterDispatch === void 0) {
            this._middlewaresAfterDispatch = [];
        }

        this._middlewaresAfterDispatch.push(middleware);

        return middleware;
    }

    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T> {
        if (false === subscriber.id in this._subscribers) {
            subscriber = this.onSubscriberAdd(subscriber);

            this._subscribers[subscriber.id] = subscriber;

            this._subscribersCount ++;
        }

        return subscriber;
    }

    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this {
        if (subscriber.id in this._subscribers) {
            subscriber = this.onSubscriberRemove(subscriber).unsubscribe();

            delete this._subscribers[subscriber.id];

            this._subscribersCount --;
        }

        return this;
    }

    protected _subscriberOnComplete(subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber.doComplete();
            }
        } else {
            for (const subscriberId in this._subscribers) {
                const subscriber = this._subscribers[subscriberId];

                if (! subscriber.isIsolated) {
                    this._subscribers[subscriberId].doComplete();
                }
            }
        }

        return this;
    }

    protected _subscriberOnData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber.doData(data);
            }
        } else {
            for (const subscriberId in this._subscribers) {
                const subscriber = this._subscribers[subscriberId];

                if (! subscriber.isIsolated) {
                    this._subscribers[subscriberId].doData(data);
                }
            }
        }

        return this;
    }

    protected _subscriberOnError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber.doError(error);
            }
        } else {
            for (const subscriberId in this._subscribers) {
                const subscriber = this._subscribers[subscriberId];

                if (! subscriber.isIsolated) {
                    this._subscribers[subscriberId].doError(error);
                }
            }
        }

        return this;
    }

    protected onSubscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T> {
        return subscriber;
    }

    protected onSubscriberRemove(subscriber: SubscriberInterface<T>): SubscriberInterface<T> {
        return subscriber;
    }

}
