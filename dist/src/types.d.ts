import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from './interfaces/subscriber_interface';
export declare type Primitive = boolean | number | string;
export declare type OnComplete<T> = (stream: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export declare type OnData<T> = (data?: T, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export declare type OnError<T> = (error?: any, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[]) => any;
export declare type PromiseOrT<T> = Promise<T> | T;
export declare type StreamMiddleware<T> = (data: T, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[], middlewareIndex?: number, cb?: (data: T) => T) => T | Promise<T> | Error;
