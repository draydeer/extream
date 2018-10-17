import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from './interfaces/subscriber_interface';
import {Cancelled} from './const';

export type Primitive = boolean | number | string;
export type OnComplete<T> = (subscribers?: SubscriberInterface<T>[]) => any;
export type OnCompleteOrStream<T> = OnComplete<T>|StreamInterface<T>;
export type OnData<T> = (data?: T, subscribers?: SubscriberInterface<T>[]) => any;
export type OnDataOrStream<T> = OnData<T>|StreamInterface<T>;
export type OnError<T> = (error?: any, subscribers?: SubscriberInterface<T>[]) => any;
export type OnErrorOrStream<T> = OnError<T>|StreamInterface<T>;
export type PromiseOrT<T> = Promise<T> | T;
export type StreamMiddleware<T> = (
    data: T,
    stream?: StreamInterface<T>,
    subscribers?: SubscriberInterface<T>[],
    middlewareIndex?: number,
    cb?: (data: T) => T
) => T | Promise<T> | {new(): Cancelled} | Error;
