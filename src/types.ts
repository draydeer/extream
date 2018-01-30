import {StreamInterface} from "./interfaces/stream_interface";
import {SubscriberInterface} from './interfaces/subscriber_interface';

export type Primitive = boolean | number | string;
export type OnComplete = () => any;
export type OnData<T> = (data?: T) => any;
export type OnError = (error?: any) => any;
export type PromiseOrT<T> = Promise<T> | T;
export type StreamMiddleware<T> = (
    data: T,
    stream?: StreamInterface<T>,
    subscribers?: SubscriberInterface<T>[],
    middlewareIndex?: number,
    cb?: (data: T) => T
) => T | Promise<T> | Error;
