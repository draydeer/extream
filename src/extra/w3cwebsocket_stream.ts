import {Stream} from "../stream";
import {w3cwebsocket as WebSocketClient} from "websocket";
import {StreamInterface} from "../interfaces/stream_interface";
import {SubscriberInterface} from '../interfaces/subscriber_interface';

export class W3CWebsocketStream<T> extends Stream<T> {

    protected _client: any;

    public constructor(url: string) {
        super();

        this.init(url);
    }

    public emit(data: T, subscribers?: SubscriberInterface<T>[]): this {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(String(data));
        }

        return this;
    }

    protected init(url: string) {
        const client = new WebSocketClient(url);

        this.pause();

        client.onclose = this.onComplete.bind(this);
        client.onerror = this.onError.bind(this);
        client.onmessage = this.onData.bind(this);
        client.onopen = super.resume.bind(this);

        this._client = client;
    }

    protected onComplete() {
        super.complete();
    }

    protected onData(data: any) {
        super.emit(data.data);
    }

    protected onError(error: any) {
        super.error(error);
    }

}
