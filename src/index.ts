import {Stream} from "./stream";
import {WebsocketW3CWebsocketStream} from "./extra/websocket_w3cwebsocket_stream";

const w = new WebsocketW3CWebsocketStream<any>('ws://127.0.0.1:9999/echo').filter((m) => m == "11" || m == "22");

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
