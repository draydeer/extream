import * as express from 'express';
import * as qs from 'querystring';
import {CANCELLED} from '../const';
import {Msg, makeBy} from '../msg';
import {Stream} from "../stream";
import {SubscriberInterface} from '../interfaces/subscriber_interface';
import {PromiseOrT} from '../types';
import {StreamInterface} from '../interfaces/stream_interface';

export const EXPRESS_STREAM_REQUEST_MSG: Msg = {type: 'request'};
export const EXPRESS_STREAM_ROUTE_REGISTERED_MSG: Msg = {type: 'routeRegistered'};
export const EXPRESS_STREAM_STARTED_MSG: Msg = {type: 'started'};

export class ExpressStream<T> extends Stream<Msg> {

    protected _app: express.Express = express();
    protected _routers: {[key: string]: express.Router} = {};
    protected _withPrefix: string = '/';

    public get app(): express.Express {
        return this._app;
    }

    public getExpressRouter(prefix: string): express.Router {
        if (! (prefix in this._routers)) {
            this._routers[prefix] = express.Router();
        }

        return this._routers[prefix];
    }

    public handle(route, method='get'): ExpressHandlerStream<T> {
        switch (method) {
            case 'all':
            case 'delete':
            case 'get':
            case 'patch':
            case 'post':
            case 'put':
                const routeHandlerStream = new ExpressHandlerStream<T>(this);

                this.getExpressRouter(this._withPrefix)[method](route, (req, res, next) => {
                    this.emit(makeBy(EXPRESS_STREAM_REQUEST_MSG, {method, route, req, res}));

                    const sessionStream = new ExpressSessionStream(req, res);

                    //sessionStream.emit(sessionStream, routeHandlerStream.subscribers);

                    routeHandlerStream.emit(new ExpressSessionStream(req, res));
                });

                this.emit(makeBy(EXPRESS_STREAM_ROUTE_REGISTERED_MSG, {method, route}));

                return routeHandlerStream;
        }

        throw new Error(`Unsupported method: ${method}`);
    }

    public start(port: number = 8080): this {
        Object.keys(this._routers).forEach((key) => this._app.use(key, this._routers[key]));

        this._app.listen(port, () => super.emit(EXPRESS_STREAM_STARTED_MSG));

        return this;
    }

    public withPrefix(prefix: string): this {
        this._withPrefix = prefix;

        return this;
    }

}

export class ExpressHandlerStream<T> extends Stream<ExpressSessionStream<string & T>> {

    public constructor(protected _stream: ExpressStream<T>) {
        super();
    }

    public getCompatible(): this {
        return new ExpressHandlerStream<T>(this._stream) as this;
    }

    public handle(route, method='get'): ExpressHandlerStream<T> {
        return this._stream.handle(route, method);
    }

    public withPrefix(prefix: string): ExpressStream<T> {
        return this._stream.withPrefix(prefix);
    }

    // middlewares

    public contentType(contentType: string): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.res.contentType(contentType);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public extractBody(): this {
        this._middlewareAdd((data: ExpressSessionStream<string & T>, stream, subscribers, middlewareIndex, cb) => {
            data.body = <any>'';

            data.req
                .on('data', (chunk) => data.body = <any>data.body + <any>chunk.toString())
                .on('end', () => this._emitLoop(subscribers, middlewareIndex, cb, data))
                .on('error', (err) => this.error(err));

            return CANCELLED;
        });

        return this;
    }

    public extractForm(): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.body = <any>qs.parse(session.body);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public extractJson(): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.body = JSON.parse(session.body);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public json(): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.res.json(session.body);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public jsonp(): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.res.jsonp(session.body);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public send(): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.res.send(session.body);

                return session;
            } catch (err) {
                this.error(err);

                return CANCELLED;
            }
        });

        return this;
    }

    public status(status: number): this {
        this._middlewareAdd((session: ExpressSessionStream<string & T>) => {
            try {
                session.res.status(status);

                return session;
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
