import { StreamInterface } from '../interfaces/stream_interface';
import { Stream } from "../stream";
export declare class FetchStream<T> extends Stream<T> {
    protected _url: string;
    protected _options: any;
    static delete<T>(url: string, _options?: any): FetchStream<T>;
    static get<T>(url: string, _options?: any): FetchStream<T>;
    static options<T>(url: string, _options?: any): FetchStream<T>;
    static patch<T>(url: string, data: T, _options?: any): FetchStream<T>;
    static post<T>(url: string, data: T, _options?: any): FetchStream<T>;
    static put<T>(url: string, data: T, _options?: any): FetchStream<T>;
    constructor(_url: string, _options?: any);
    emit(options?: any): this;
    delete<T>(options?: any): this;
    get<T>(options?: any): this;
    options<T>(options?: any): this;
    patch<T>(body: T, options?: any): this;
    post<T>(body: T, options?: any): this;
    put<T>(body: T, options?: any): this;
    extractBlob(): StreamInterface<T>;
    extractFormData(): StreamInterface<T>;
    extractJson(): StreamInterface<T>;
    extractText(): StreamInterface<T>;
    protected _request(url: string, options?: any): any;
}
