import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from './interfaces/subscriber_interface';
import { Cancelled } from './const';
export declare type Primitive = boolean | number | string;
export declare type OnComplete<T> = (subscribers?: SubscriberInterface<T>[]) => any;
export declare type OnCompleteOrStream<T> = OnComplete<T> | StreamInterface<T>;
export declare type OnData<T> = (data?: T, subscribers?: SubscriberInterface<T>[]) => any;
export declare type OnDataOrStream<T> = OnData<T> | StreamInterface<T>;
export declare type OnError<T> = (error?: any, subscribers?: SubscriberInterface<T>[]) => any;
export declare type OnErrorOrStream<T> = OnError<T> | StreamInterface<T>;
export declare type PromiseOrT<T> = Promise<T> | T;
export declare type StreamMiddleware<T> = (data: T, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[], middlewareIndex?: number, cb?: (data: T) => T) => T | Promise<T> | {
    new (): Cancelled;
} | Error;
