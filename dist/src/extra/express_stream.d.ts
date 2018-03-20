/// <reference types="express" />
import * as express from 'express';
import { Msg } from '../msg';
import { Stream } from "../stream";
import { SubscriberInterface } from '../interfaces/subscriber_interface';
export declare const EXPRESS_STREAM_REQUEST_MSG: Msg;
export declare const EXPRESS_STREAM_ROUTE_REGISTERED_MSG: Msg;
export declare const EXPRESS_STREAM_STARTED_MSG: Msg;
export declare class ExpressStream<T> extends Stream<Msg> {
    protected _app: express.Express;
    protected _routers: {
        [key: string]: express.Router;
    };
    protected _withPrefix: string;
    readonly app: express.Express;
    getExpressRouter(prefix: string): express.Router;
    handle(route: any, method?: string): ExpressHandlerStream<T>;
    start(port?: number): this;
    withPrefix(prefix: string): this;
}
export declare class ExpressHandlerStream<T> extends Stream<ExpressSessionStream<string & T>> {
    protected _stream: ExpressStream<T>;
    constructor(_stream: ExpressStream<T>);
    handle(route: any, method?: string): ExpressHandlerStream<T>;
    withPrefix(prefix: string): ExpressStream<T>;
    extractBody(): this;
    extractForm(): this;
    extractJson(): this;
}
export declare class ExpressSessionStream<T> extends Stream<T> {
    protected _req: express.Request;
    protected _res: express.Response;
    body: T;
    constructor(_req: express.Request, _res: express.Response);
    readonly req: express.Request;
    readonly res: express.Response;
    status(status: number): this;
    protected _shutdown(): this;
    protected _subscriberOnData(data: any, subscribers?: SubscriberInterface<any>[]): this;
    protected _subscriberOnComplete(subscribers?: SubscriberInterface<any>[]): this;
}
