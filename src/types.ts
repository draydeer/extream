import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from './interfaces/subscriber_interface';

export type Primitive = boolean | number | string;
export type OnComplete<T> = (stream: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export type OnData<T> = (data?: T, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export type OnError<T> = (error?: any, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export type PromiseOrT<T> = Promise<T> | T;
export type StreamMiddleware<T> = (
    data: T,
    stream?: StreamInterface<T>,
    subscribers?: SubscriberInterface<T>[],
    middlewareIndex?: number,
    cb?: (data: T) => T
) => T | Promise<T> | Error;
