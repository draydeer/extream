import {StreamInterface} from "./interfaces/stream_interface";

export type Primitive = boolean | number | string;
export type OnComplete = () => any;
export type OnData<T> = (data?: T) => any;
export type OnError = (error?: any) => any;
export type StreamMiddleware<T> = (data: T, stream?: StreamInterface<T>) => T | Promise<T> | Error;
