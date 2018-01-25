import {Stream} from "./stream";
import {WebsocketW3CWebsocketStream} from "./extra/websocket_w3cwebsocket_stream";
import {Executor} from "./executor";
import {Delegate} from "./delegate";
import {IntervalStream} from "./extra/interval_stream";
import {StreamBuffer} from './stream_buffer';
import {FetchStream} from './extra/fetch_stream';

//const w = new WebsocketW3CWebsocketStream<any>('ws://127.0.0.1:9999/echo').filter((m) => m == "11" || m == "22");
//
//w.subscribe(
//    (data: any) => {
//        console.log("11: " + data);
//    },
//    (error: any) => {
//        console.log(error);
//    },
//    () => {
//        console.log('complete!');
//    }
//);
//
//w.fork().filter((m) => m == "22").subscribe(
//    (data: any) => {
//        console.log("22: " + data);
//    },
//    (error: any) => {
//        console.log(error);
//    },
//    () => {
//        console.log('complete!');
//    }
//);
//
//setTimeout(() => {
//    w.emit("1");
//}, 1000);
//
//setTimeout(() => {
//    w.emit("2");
//}, 2000);
//
//setTimeout(() => {
//    w.emit("3");
//}, 3000);

(async () => {
    const buf = new StreamBuffer(3);

    const fs = FetchStream.post<any>('https://google.com', 'test')
        .filter((data) => {
            return true;
        })
        .extractText()
        .exec((data) => data.substr(0, 10))
        .subscribe((data) => console.log(data), (err) => console.error(err));

    // const s1 = new Stream<any>().map((data: any) => "11");
    // const s2 = new Stream<any>().map((data: any) => "22");
    // const s3 = new Stream<any>().map((data: any) => "33");
    // const s4 = new IntervalStream<any>(0.5).map(() => "b");
    // const s5 = new Stream<any>().map((data: any) => console.log(data) && "5");
    //
    // const e = new Executor<any>(async (delegate: Delegate<any>) => {
    //     delegate.emit("start");
    //
    //     const r = await delegate.race(s1, s2, s3).filter((a) => a !== "a").toPromise();
    //
    //     delegate.emit("stop");
    //
    //     return r;
    // }).pipeToIncoming(s4).pipeOutgoingTo(s5);
    //
    // e.then(() => console.log('ok')).catch(() => console.log('err'));

    // setTimeout(() => e.complete(), 1000);
    // setTimeout(() => s2.emit(1), 6000);
})();
