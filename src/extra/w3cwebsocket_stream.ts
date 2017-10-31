import {Stream} from "../stream";
import {w3cwebsocket as WebSocketClient} from "websocket";

export class W3CWebSocketStream extends Stream<any> {

    protected _client: any;

    public constructor(url: string) {
        super();

        const client = new WebSocketClient(url);

        this.pause();

        client.onclose = super.complete.bind(this);
        client.onerror = super.error.bind(this);
        client.onmessage = (data: any) => super.emit(data.data);
        client.onopen = super.resume.bind(this);

        this._client = client;
    }

    public emit(data: any): this {
        if (this._client.readyState === this._client.OPEN) {
            this._client.send(data);
        }

        return this;
    }
}
