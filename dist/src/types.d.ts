import { StreamInterface } from "./interfaces/stream_interface";
import { SubscriberInterface } from './interfaces/subscriber_interface';
export declare type Primitive = boolean | number | string;
export declare type OnComplete = () => any;
export declare type OnData<T> = (data?: T) => any;
export declare type OnError = (error?: any) => any;
export declare type StreamMiddleware<T> = (data: T, stream?: StreamInterface<T>, subscribers?: SubscriberInterface<T>[], middlewareIndex?: number, cb?: (data: T) => T) => T | Promise<T> | Error;
