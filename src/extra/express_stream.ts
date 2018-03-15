import * as express from 'express';
import * as qs from 'querystring';
import {CANCELLED} from '../const';
import {Msg, makeBy} from '../msg';
import {Stream} from "../stream";
import {SubscriberInterface} from '../interfaces/subscriber_interface';

export const EXPRESS_STREAM_REQUEST_MSG: Msg = {type: 'request'};
export const EXPRESS_STREAM_ROUTE_REGISTERED_MSG: Msg = {type: 'routeRegistered'};
export const EXPRESS_STREAM_STARTED_MSG: Msg = {type: 'started'};

export class ExpressStream<T> extends Stream<Msg> {

    protected _app: express.Express = express();
    protected _routers: {[key: string]: ExpressRouterStream<T>} = {};

    public get app(): express.Express {
        return this._app;
    }

    public handle(route, method='get'): ExpressRouteHandlerStream<T> {
        return this.router().handle(route, method);
    }

    public router(prefix: string = '/'): ExpressRouterStream<T> {
        if (! (prefix in this._routers)) {
            this._routers[prefix] = new ExpressRouterStream(this, prefix);
        }

        return this._routers[prefix];
    }

    public start(port: number = 8080): this {
        Object.keys(this._routers).forEach((key) => this._routers[key].start());

        this._app.listen(port, () => this.emit(EXPRESS_STREAM_STARTED_MSG));

        return this;
    }

}

export class ExpressRouterStream<T> extends Stream<ExpressSessionStream<T>> {

    protected _router: express.Router = express.Router();

    public constructor(protected _stream: ExpressStream<T>, protected _prefix: string = '/') {
        super();

        this.progressive();
    }

    public handle(route, method='get'): ExpressRouteHandlerStream<T> {
        const routeHandlerStream = new ExpressRouteHandlerStream<T>(this);
        const subscriptions = [this.subscribeStream(<any>routeHandlerStream)];

        switch (method) {
            case 'all':
                this._router.all(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            case 'delete':
                this._router.delete(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            case 'get':
                this._router.get(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            case 'patch':
                this._router.patch(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            case 'post':
                this._router.post(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            case 'put':
                this._router.put(route, (req, res, next) => {
                    this.emit(new ExpressSessionStream(req, res), subscriptions);
                });

                break;

            default:
                throw new Error(`Unsupported method: ${method}`);
        }

        this._stream.emit(makeBy(EXPRESS_STREAM_ROUTE_REGISTERED_MSG, {method, route}));

        return routeHandlerStream;
    }

    public start(): this {
        this._stream.app.use(this._prefix, this._router);

        return this;
    }

    // middlewares

    public extractBody(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>, stream, subscribers, middlewareIndex, cb) => {
            data.body = <any>'';

            data.req
                .on('data', (chunk) => data.body += <any>chunk.toString())
                .on('end', () => this._emitLoop(subscribers, middlewareIndex, cb, data))
                .on('error', (err) => this.error(err));

            return CANCELLED;
        });

        return this;
    }

    public extractForm(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>) => {
            data.req.body = qs.parse(data.req.body);

            return data;
        });

        return this;
    }

    public extractJson(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>) => {
            try {
                data.req.body = JSON.parse(data.req.body);

                return data;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

}

export class ExpressRouteHandlerStream<T> extends Stream<ExpressSessionStream<T>> {

    public constructor(protected _routerStream: ExpressRouterStream<T>) {
        super();
    }

    public get router(): ExpressRouterStream<T> {
        return this._routerStream;
    }

    // middlewares

    public extractBody(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>, stream, subscribers, middlewareIndex, cb) => {
            data.body = <any>'';

            data.req
                .on('data', (chunk) => data.body += <any>chunk.toString())
                .on('end', () => this._emitLoop(subscribers, middlewareIndex, cb, data))
                .on('error', (err) => this.error(err));

            return CANCELLED;
        });

        return this;
    }

    public extractForm(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>) => {
            data.req.body = qs.parse(data.req.body);

            return data;
        });

        return this;
    }

    public extractJson(): this {
        this._middlewareAdd((data: ExpressSessionStream<T>) => {
            try {
                data.req.body = JSON.parse(data.req.body);

                return data;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

}

export class ExpressSessionStream<T> extends Stream<T> {

    public body: T;

    public constructor(protected _req: express.Request, protected _res: express.Response) {
        super();
    }

    public get req(): express.Request {
        return this._req;
    }

    public get res(): express.Response {
        return this._res;
    }

    public status(status: number): this {
        this._res.status(status);

        return this;
    }

    protected _shutdown(): this {
        super._shutdown();

        this._req = this._res = void 0;

        return this;
    }

    protected _subscriberOnData(data: any, subscribers?: SubscriberInterface<any>[]): this {
        super._subscriberOnData(data, subscribers);

        if (this._res) {
            this._res.send(data);
        }

        return this;
    }

    protected _subscriberOnComplete(subscribers?: SubscriberInterface<any>[]): this {
        super._subscriberOnComplete(subscribers);

        if (this._res) {
            this._res.end();
        }

        return this;
    }

}
