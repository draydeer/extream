import * as fetch from "node-fetch";
import {StreamInterface} from '../interfaces/stream_interface';
import {Stream} from "../stream";

export interface FetchStreamInterface<T> extends StreamInterface<T> {
    extractBlob(): this;
    extractFormData(): this;
    extractJson(): this;
    extractText(): this;
}

export class FetchResponseStream<T> extends Stream<T> implements FetchStreamInterface<T> {

    // middlewares

    public extractBlob() {
        return this._middlewareAdd((data: any, stream) => data.blob());
    }

    public extractFormData() {
        return this._middlewareAdd((data: any, stream) => data.formData());
    }

    public extractJson() {
        return this._middlewareAdd((data: any, stream) => data.json());
    }

    public extractText() {
        return this._middlewareAdd((data: any, stream) => data.text());
    }

    public emit(options?: any): this {
        return super.emit(options);
    }

}

export class FetchStream<T> extends FetchResponseStream<T> {

    public static delete<T>(url: string, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).delete(_options);
    }

    public static get<T>(url: string, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).get(_options);
    }

    public static options<T>(url: string, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).options(_options);
    }

    public static patch<T>(url: string, data: T, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).patch(data, _options);
    }

    public static post<T>(url: string, data: T, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).post(data, _options);
    }

    public static put<T>(url: string, data: T, _options?: any): FetchStream<T> {
        return new FetchStream<T>(url).put(data, _options);
    }

    public constructor(protected _url: string, protected _options?: any) {
        super();
    }

    public get clone(): this {
        return new FetchResponseStream<T>() as this;
    }

    public emit(options?: any): this {
        options = Object.assign({}, this._options, options);

        if (options.method === void 0) {
            options.method = 'GET';
        }

        this._request(this._url, options);

        return this;
    }

    public delete<T>(options?: any): this {
        return this.emit(options ? Object.assign(options, {method: 'DELETE'}) : {method: 'DELETE'});
    }

    public get<T>(options?: any): this {
        return this.emit(options ? Object.assign(options, {method: 'GET'}) : {method: 'GET'});
    }

    public options<T>(options?: any): this {
        return this.emit(options ? Object.assign(options, {method: 'OPTIONS'}) : {method: 'OPTIONS'});
    }

    public patch<T>(body: T, options?: any): this {
        return this.emit(options ? Object.assign(options, {body, method: 'PATCH'}) : {body, method: 'PATCH'});
    }

    public post<T>(body: T, options?: any): this {
        return this.emit(options ? Object.assign(options, {body, method: 'POST'}) : {body, method: 'POST'});
    }

    public put<T>(body: T, options?: any): this {
        return this.emit(options ? Object.assign(options, {body, method: 'PUT'}) : {body, method: 'PUT'});
    }

    protected _request(url: string, options?: any) {
        return fetch(url, Object.assign(options || {}, this._options)).then((response) => {
            super.emit(response);
        }).catch((error) => {
            this.error(error);
        });
    }

}
