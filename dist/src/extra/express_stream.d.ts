/// <reference types="express" />
import * as express from 'express';
import { Msg } from '../msg';
import { Stream } from "../stream";
import { SubscriberInterface } from '../interfaces/subscriber_interface';
export declare const EXPRESS_STREAM_REQUEST_MSG: Msg;
export declare const EXPRESS_STREAM_ROUTE_REGISTERED_MSG: Msg;
export declare const EXPRESS_STREAM_STARTED_MSG: Msg;
export declare class ExpressStream extends Stream<Msg> {
    protected _app: express.Express;
    protected _routers: {
        [key: string]: ExpressRouterStream;
    };
    readonly app: express.Express;
    handle(route: any, method?: string): ExpressRouteHandlerStream;
    router(prefix?: string): ExpressRouterStream;
    start(port?: number): this;
}
export declare class ExpressRouterStream extends Stream<ExpressSessionStream> {
    protected _stream: ExpressStream;
    protected _prefix: string;
    protected _router: express.Router;
    constructor(_stream: ExpressStream, _prefix?: string);
    handle(route: any, method?: string): ExpressRouteHandlerStream;
    start(): this;
    extractBody(): this;
    extractForm(): this;
    extractJson(): this;
}
export declare class ExpressRouteHandlerStream extends Stream<ExpressSessionStream> {
    protected _routerStream: ExpressRouterStream;
    constructor(_routerStream: ExpressRouterStream);
    readonly router: ExpressRouterStream;
    extractBody(): this;
    extractForm(): this;
    extractJson(): this;
}
export declare class ExpressSessionStream extends Stream<any> {
    protected _req: express.Request;
    protected _res: express.Response;
    constructor(_req: express.Request, _res: express.Response);
    readonly req: express.Request;
    readonly res: express.Response;
    status(status: number): this;
    protected _shutdown(): this;
    protected _subscriberOnData(data: any, subscribers?: SubscriberInterface<any>[]): this;
    protected _subscriberOnComplete(subscribers?: SubscriberInterface<any>[]): this;
}
