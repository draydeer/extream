import { StreamInterface } from '../interfaces/stream_interface';
import { Stream } from "../stream";
import { SubscriberInterface } from '../interfaces/subscriber_interface';
export interface FetchStreamInterface<T> extends StreamInterface<T> {
    extractBlob(): this;
    extractFormData(): this;
    extractJson(): this;
    extractText(): this;
}
export declare class FetchResponseStream<T> extends Stream<T> implements FetchStreamInterface<T> {
    getCompatible(): this;
    extractBlob(): this;
    extractFormData(): this;
    extractJson(): this;
    extractText(): this;
}
export declare class FetchStream<T> extends FetchResponseStream<T> {
    protected _url: string;
    protected _options: any;
    static delete<T>(url: string, _options?: any): FetchStream<T>;
    static get<T>(url: string, _options?: any): FetchStream<T>;
    static options<T>(url: string, _options?: any): FetchStream<T>;
    static patch<T>(url: string, data: T, _options?: any): FetchStream<T>;
    static post<T>(url: string, data: T, _options?: any): FetchStream<T>;
    static put<T>(url: string, data: T, _options?: any): FetchStream<T>;
    constructor(_url: string, _options?: any);
    emit(options?: any, subscribers?: SubscriberInterface<T>[]): this;
    delete<T>(options?: any): this;
    get<T>(options?: any): this;
    options<T>(options?: any): this;
    patch<T>(body: T, options?: any): this;
    post<T>(body: T, options?: any): this;
    put<T>(body: T, options?: any): this;
    protected _request(url: string, options?: any, subscribers?: SubscriberInterface<T>[]): any;
}
