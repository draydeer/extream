import * as fetch from "node-fetch";
import {StreamInterface} from '../interfaces/stream_interface';
import {Stream} from "../stream";
import {SubscriberInterface} from '../interfaces/subscriber_interface';

export interface FetchStreamInterface<T> extends StreamInterface<T> {
    extractBlob(): this;
    extractFormData(): this;
    extractJson(): this;
    extractText(): this;
}

export class FetchResponseStream<T> extends Stream<T> implements FetchStreamInterface<T> {

    public get compatible(): this {
        return new FetchResponseStream<T>() as this;
    }

    // middlewares

    public extractBlob() {
        return this._middlewareAdd((data: any, stream) => data.blob()).await();
    }

    public extractFormData() {
        return this._middlewareAdd((data: any, stream) => data.formData()).await();
    }

    public extractJson() {
        return this._middlewareAdd((data: any, stream) => data.json()).await();
    }

    public extractText() {
        return this._middlewareAdd((data: any, stream) => data.text()).await();
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

    public emit(options?: any, subscribers?: SubscriberInterface<T>[]): this {
        options = Object.assign({}, this._options, options);

        if (options.method === void 0) {
            options.method = 'GET';
        }

        this._request(this._url, options, subscribers);

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

    protected _request(url: string, options?: any, subscribers?: SubscriberInterface<T>[]) {
        return fetch(url, Object.assign(options || {}, this._options)).then((response) => {
            super.emit(response, subscribers);
        }).catch((error) => {
            this.error(error);
        });
    }

}
