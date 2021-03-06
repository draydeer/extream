import {CyclicBuffer} from "./buffer";
import {Cancelled, Completed} from "./const";
import {BufferInterface} from "./interfaces/buffer_interface";
import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from "./interfaces/subscriber_interface";
import {Storage} from './storage';
import {Subscriber, UnsafeSubscriber} from "./subscriber";
import {StreamMiddleware, OnCompleteOrStream, OnDataOrStream, OnErrorOrStream} from "./types";
import {PromiseOrT} from "./types";
import {ResourceInterface} from './interfaces/resource_interface';
import {StreamIsCompletedError} from './errors';
import {TimerResource} from './resource';

const SHARED_SUBSCRIBER_TAG = 0;

/**
 * Stream.
 */
export class Stream<T> implements StreamInterface<T> {

    protected _isAutocomplete: boolean;
    protected _isCold: boolean;
    protected _isCompleted: boolean;
    protected _isPaused: boolean;
    protected _isProcessing: boolean;
    protected _isProgressive: boolean;
    protected _isShared: boolean;
    protected _isSynchronized: boolean;
    protected _lastValue: T;
    protected _middlewares: StreamMiddleware<T>[];
    protected _middlewaresAfterDispatch: StreamMiddleware<T>[];
    protected _inpBuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _outBuffer: BufferInterface<[T, SubscriberInterface<T>[]]>;
    protected _resources: ResourceInterface<any>[];
    protected _root: StreamInterface<T>;
    protected _subscribers: Storage<SubscriberInterface<T>>;
    protected _transmittedCount: number = 0;

    public static get COMPLETED(): {} {
        return Completed;
    };

    public static fromPromise<T>(promise: Promise<T>): StreamInterface<T> {
        const stream: StreamInterface<T> = new Stream<T>();

        promise.then(stream.emitAndComplete.bind(stream)).catch(stream.error.bind(stream));

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

    public get isCompleted(): boolean {
        return this._isCompleted === true;
    }

    public get isPaused(): boolean {
        return this._isPaused;
    }

    public get isShared(): boolean {
        return this._isShared;
    }

    public get lastValue(): T {
        return this._lastValue;
    }
    
    public get root(): this {
        return this._root as this || this;
    }

    public get subscribers(): SubscriberInterface<T>[] {
        return this._subscribers ? this._subscribers.storage : void 0;
    }

    public get subscribersCount(): number {
        return this._subscribers ? this._subscribers.storage.length : 0;
    }

    public get transmittedCount(): number {
        return this._transmittedCount;
    }

    public getCompatible(): this {
        return new Stream<T>() as this;
    }

    public setRoot(stream: StreamInterface<T>): this {
        if (stream !== this) {
            this._root = stream;
        }

        return this;
    }

    /**
     * Enables automatic completion of stream if count of subscribers becomes zero.
     */
    public autoComplete(): this {
        this._isAutocomplete = true;

        return this;
    }

    /**
     *
     */
    public cold(): this {
        this._isCold = true;

        return this;
    }

    public complete(subscribers?: SubscriberInterface<T>[]): this {
        this._assertReady()._shutdown();

        return this;
    }

    public emit(data: T, subscribers?: SubscriberInterface<T>[]): this {
        this._assertReady();

        if (this._inpBuffer) {
            if (this._isProcessing) {
                this._inpBuffer.add([data, subscribers]);
            } else {
                this._emitLoop(subscribers, 0, void 0, data);
            }
        } else {
            this._emitLoop(subscribers, 0, void 0, data);
        }

        return this;
    }

    public emitAndComplete(data: T, subscribers?: SubscriberInterface<T>[]): this {
        this._assertReady();

        if (this._inpBuffer) {
            if (this._isProcessing) {
                this._inpBuffer.add([data, subscribers]);
            } else {
                this._emitLoop(subscribers, 0, this.complete.bind(this, subscribers), data);
            }
        } else {
            this._emitLoop(subscribers, 0, this.complete.bind(this, subscribers), data);
        }

        return this;
    }

    public error(error: any, subscribers?: SubscriberInterface<T>[]): this {
        this._assertReady()._subscriberOnError(error, subscribers);

        return this;
    }

    public shared(): this {
        this._isShared = true;

        return this;
    }

    public fork(): this {
        let stream = this.getCompatible();

        this.subscribeStream(stream);

        return stream.setRoot(this.root);
    }

    /**
     * Pauses stream stopping processing of emitted values.
     */
    public pause(): this {
        this._isPaused = true;

        return this;
    }

    /**
     * Initiates input buffer where emitted values will be stored before to be processed.
     */
    public inpBuffer(size: number = 10): this {
        this._inpBuffer = new CyclicBuffer(size);

        return this;
    }

    /**
     * Initiates output buffer where emitted and processed values will be stored before to be sent to subscribers.
     */
    public outBuffer(size: number = 10): this {
        this._outBuffer = new CyclicBuffer(size);

        return this;
    }

    /**
     * Enables progressive mode when added middleware will be chained inside current stream instead initiate new one.
     */
    public progressive(): this {
        this._isProgressive = true;

        return this;
    }

    /**
     * Resumes stream starting processing of emitted values.
     */
    public resume(): this {
        this._isPaused = false;

        return this;
    }

    /**
     *
     */
    public synchronized(): this {
        this._isSynchronized = true;

        return this;
    }

    public subscribe(onData?: OnDataOrStream<T>, onError?: OnErrorOrStream<T>, onComplete?: OnCompleteOrStream<T>): SubscriberInterface<T> {
        return this._subscriberAdd(new Subscriber<T>(
            this,
            onData instanceof Stream ? onData.emit.bind(onData) : onData,
            onError instanceof Stream ? onError.error.bind(onError) : onError,
            onComplete instanceof Stream ? onComplete.complete.bind(onComplete) : onComplete,
        ));
    }

    public subscribeOnComplete(onComplete?: OnCompleteOrStream<T>): SubscriberInterface<T> {
        return this._subscriberAdd(new Subscriber<T>(
            this,
            void 0,
            void 0,
            onComplete instanceof Stream ? onComplete.complete.bind(onComplete) : onComplete,
        ));
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

    /** Checks is data is async and plans its postponed emission */
    public await(): this {
        return this._middlewareAdd((data: T, stream, subscribers, middlewareIndex, cb) => {
            if (data instanceof Promise) {
                data.then(
                    this._emitLoop.bind(this, subscribers, middlewareIndex, cb),
                    (error) => this._subscriberOnError(error, subscribers)
                );

                return Cancelled;
            } else if (data instanceof Stream) {
                data.subscribe(
                    this._emitLoop.bind(this, subscribers, middlewareIndex, cb),
                    (error) => this._subscriberOnError(error, subscribers)
                );

                return Cancelled;
            }

            return data;
        }, true);
    }

    /** Continues processing after expiration of  */
    public debounce(seconds: number): this {
        let cachedData;
        let timerResource = this._resourceAdd(new TimerResource());

        return this._middlewareAdd((data, stream, subscribers, middlewareIndex, cb) => {
            cachedData = data;

            timerResource
                .clear()
                .open(() => this._emitLoop(subscribers, middlewareIndex, cb, cachedData), seconds);

            return Cancelled;
        });
    }

    /** Runs debug callback then returns incoming data as is */
    public debug(callback: (data: T, stream?: StreamInterface<T>) => void): this {
        return this._middlewareAdd((data) => {
            callback(data);

            return data;
        }, true);
    }

    /** Dispatches data to subscribers ahead of processing by remained middlewares */
    public dispatch(): this {
        return this._middlewareAdd((data) => {
            this._subscriberOnData(data);

            return data;
        });
    }

    /** Executes custom handler over data then returns result value or income data as is if returned value is undefined */
    public exec(middleware: (data: T, stream?: StreamInterface<T>) => PromiseOrT<T>): this {
        return this._middlewareAdd((data, stream) => {
            let result = middleware(data, stream);

            return result !== void 0 ? result : data;
        });
    }

    /** Filters data comparing with initial value or by applying custom handler that returns boolean */
    public filter(middleware: T|((data: T, stream?: StreamInterface<T>) => boolean)): this {
        return this._middlewareAdd(
            middleware instanceof Function
                ? (data, stream) => middleware(data, stream) ? data : Cancelled
                : (data, stream) => middleware === data ? data : Cancelled
        );
    }

    /** Completes after first value received */
    public first(): this {
        this._middlewareAfterDispatchAdd((data) => {
            this.complete();

            return data;
        });

        return this;
    }

    /** Maps data by replacing by initial value or by applying custom handler */
    public map(middleware: (data: T, stream?: StreamInterface<T>) => PromiseOrT<T>): this {
        return this._middlewareAdd(middleware);
    }

    /** Redirects data to selected stream */
    public redirect(selector: (data: T) => string, streams: {[key: string]: StreamInterface<T>}): this {
        return this._middlewareAdd((data: T, stream, subscribers, middlewareIndex, cb) => {
            const index = selector(data);

            if (index in streams) {
                streams[index].root.emit(data, subscribers);

                return Cancelled;
            }

            throw new Error(`"redirect" middleware got invalid index from selector: ${index}`);
        });
    }

    public reduce(reducer: (accumulator: T, data: T, count?: number) => T, accumulator: T): this {
        return this._middlewareAdd((data: T) => {
            accumulator = reducer(accumulator, data, this._transmittedCount);

            return accumulator;
        });
    }

    public select(selector: (data: T) => string, streams: {[key: string]: StreamInterface<T>}): this {
        return this._middlewareAdd((data: T, stream, subscribers, middlewareIndex, cb) => {
            const index = selector(data);

            if (index in streams) {
                const subscriber = streams[index].subscribe(
                    this._emitLoop.bind(this, subscribers, middlewareIndex, cb),
                    this._subscriberOnError.bind(this),
                    // this._subscriberOnError.bind(this),
                ).once();

                streams[index].root.emit(data, [subscriber]);

                return Cancelled;
            }

            throw new Error(`"select" middleware got invalid index from selector: ${index}`);
        });
    }

    /** Opposite to "filter" */
    public skip(middleware: T|((data: T, stream?: StreamInterface<T>) => boolean)): this {
        return this._middlewareAdd(
            middleware instanceof Function
                ? (data, stream) => middleware(data, stream) ? Cancelled : data
                : (data, stream) => middleware === data ? Cancelled : data
        );
    }

    /** Continues processing after expiration of  */
    public throttle(seconds: number): this {
        let cachedData;
        let timerResource = this._resourceAdd(new TimerResource());

        return this._middlewareAdd((data, stream, subscribers, middlewareIndex, cb) => {
            cachedData = data;

            if (! timerResource.resource) {
                timerResource.open(() => this._emitLoop(subscribers, middlewareIndex, cb, cachedData), seconds);
            }

            return Cancelled;
        });
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
            this.subscribe(void 0, resolve, () => reject(Completed)).once();
        });
    }

    public toPromise(): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.subscribe(resolve, (e) => reject(e), () => reject(Completed)).once();
        });
    }

    protected _assertReady(): this {
        if (this._isCompleted) {
            throw new StreamIsCompletedError();
        }

        return this;
    }

    protected _emitLoop(subscribers, middlewareIndex, cb, data) {
        this._isProcessing = true;

        while (true) {
            if (this._middlewares) {
                for (const l = this._middlewares.length; middlewareIndex < l; middlewareIndex += 1) {
                    data = this._middlewares[middlewareIndex](data as T, this, subscribers, middlewareIndex + 1, cb);

                    if (data === Cancelled) {
                        break;
                    }
                }
            }

            if (data !== Cancelled) {
                this._lastValue = data;

                this._transmittedCount += 1;

                this._subscriberOnData(data, subscribers);
            }

            if (! this._inpBuffer || this._inpBuffer.isEmpty) {
                this._isProcessing = false;

                return cb ? cb(data) : data;
            }

            middlewareIndex = 0;

            [data, subscribers] = this._inpBuffer.shift();
        }
    }

    protected _middlewareAdd(middleware: StreamMiddleware<T>, progressive?: boolean, tag?: string): this {
        if (this._middlewares === void 0) {
            this._middlewares = [middleware];

            return this;
        }

        if (progressive || this._isProgressive) {
            this._middlewares.push(middleware);

            return this;
        }

        const stream = this.getCompatible().setRoot(this.root)._middlewareAdd(middleware);

        this._subscriberAdd(new UnsafeSubscriber<T>(
            this,
            stream.emit.bind(stream),
            stream.error.bind(stream),
            stream.complete.bind(stream)
        ));

        return stream;
    }

    protected _middlewareAfterDispatchAdd(middleware: StreamMiddleware<T>): StreamMiddleware<T> {
        if (this._middlewaresAfterDispatch === void 0) {
            this._middlewaresAfterDispatch = [];
        }

        this._middlewaresAfterDispatch.push(middleware);

        return middleware;
    }

    protected _resourceAdd(resource: ResourceInterface<any>): ResourceInterface<any> {
        if (this._resources === void 0) {
            this._resources = [];
        }

        this._resources.push(resource);

        return resource;
    }

    protected _shutdown(): this {
        this._subscriberOnComplete();

        if (this._resources) {
            for (const resource of this._resources) {
                resource.close();
            }
        }

        this._lastValue = this._root = void 0;

        return this;
    }

    protected _subscriberAdd(subscriber: SubscriberInterface<T>): SubscriberInterface<T> {
        if (! this._subscribers) {
            this._subscribers = new Storage(10, 1);
        }

        this._subscribers.add(
            this.onSubscriberAdd(subscriber), subscriber.isShared ? SHARED_SUBSCRIBER_TAG : void 0
        );

        return subscriber;
    }

    protected _subscriberRemove(subscriber: SubscriberInterface<T>): this {
        if (! this._subscribers) {
           return this;
        }

        this._subscribers.delete(
            this.onSubscriberRemove(subscriber), subscriber.isShared ? SHARED_SUBSCRIBER_TAG : void 0
        );

        return this._isAutocomplete && this.subscribersCount === 0 ? this._shutdown() : this;
    }

    protected _subscriberOnComplete(subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                if (subscriber.stream === this) {
                    subscriber.doComplete(subscribers);
                }
            }

            // trigger shared also
            if (this._subscribers) {
                const sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);

                if (sharedSubscribers) {
                    for (const subscriber of sharedSubscribers.storage) {
                        if (subscriber) {
                            subscriber.doComplete(subscribers);
                        }
                    }
                }
            }
        } else if (this._subscribers) {
            for (const subscriber of this._subscribers.storage) {
                if (subscriber) {
                    subscriber.doComplete(subscribers);
                }
            }
        }

        return this;
    }

    protected _subscriberOnData(data: T, subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                if (subscriber.stream === this) {
                    subscriber.doData(data, subscribers);
                }
            }

            // trigger shared also
            if (this._subscribers) {
                const sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);

                if (sharedSubscribers) {
                    for (const subscriber of sharedSubscribers.storage) {
                        if (subscriber) {
                            subscriber.doData(data, subscribers);
                        }
                    }
                }
            }
        } else if (this._subscribers) {
            for (const subscriber of this._subscribers.storage) {
                if (subscriber) {
                    subscriber.doData(data, subscribers);
                }
            }
        }

        return this;
    }

    protected _subscriberOnError(error: any, subscribers?: SubscriberInterface<T>[]): this {
        if (subscribers) {
            for (const subscriber of subscribers) {
                if (subscriber.stream === this) {
                    subscriber.doError(error, subscribers);
                }
            }

            // trigger shared also
            if (this._subscribers) {
                const sharedSubscribers = this._subscribers.getTagged(SHARED_SUBSCRIBER_TAG);

                if (sharedSubscribers) {
                    for (const subscriber of sharedSubscribers.storage) {
                        if (subscriber) {
                            subscriber.doError(error, subscribers);
                        }
                    }
                }
            }
        } else if (this._subscribers) {
            for (const subscriber of this._subscribers.storage) {
                if (subscriber) {
                    subscriber.doError(error, subscribers);
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
