import {Stream} from "./stream";
import {W3CWebSocketStream} from "./extra/w3cwebsocket_stream";

var WebSocketClient = require('websocket').w3cwebsocket;

class WebSocketStream extends Stream<any> {

    protected _client: any;

    public constructor() {
        super();

        const client = new WebSocketClient('ws://127.0.0.1:9999/echo');

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
        } else {
            console.error("Not ready.");
        }

        return this;
    }
}

const w = new W3CWebSocketStream('ws://127.0.0.1:9999/echo').filter((m) => m == "11" || m == "22");

w.subscribe(
    (data: any) => {
        console.log("11: " + data);
    },
    (error: any) => {
        console.log(error);
    },
    () => {
        console.log('complete!');
    }
);

w.fork().filter((m) => m == "22").subscribe(
    (data: any) => {
        console.log("22: " + data);
    },
    (error: any) => {
        console.log(error);
    },
    () => {
        console.log('complete!');
    }
);

//w.toPromise().then(() => console.log('resolved!'));

setTimeout(() => {
    w.emit("1");
}, 1000);

setTimeout(() => {
    w.emit("2");
}, 2000);

setTimeout(() => {
    w.emit("3");
}, 3000);


setTimeout(() => {}, 1000000);
