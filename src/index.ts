import {Stream} from "./stream";
import {WebsocketW3CWebsocketStream} from "./extra/websocket_w3cwebsocket_stream";
import {Executor} from "./executor";
import {Agent} from "./agent";
import {IntervalStream} from "./extra/interval_stream";

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

const s1 = new Stream<any>().map((data: any) => "11");
const s2 = new Stream<any>().map((data: any) => "22");
const s3 = new Stream<any>().map((data: any) => "33");
const s4 = new IntervalStream<any>(0.5).map(() => "b");
const s5 = new Stream<any>().map((data: any) => console.log(data) && "5");

const e = new Executor<any>(async (agent: Agent<any>) => {
    agent.emit("start");

    const r = await agent.race(s1, s2, s3).filter((a) => a !== "a").toPromise();

    agent.emit("stop");

    return r;
}).pipeToIncoming(s4).pipeOutgoingTo(s5);

e.then(() => console.log('ok')).catch(() => console.log('err'));

//setTimeout(() => e.complete(), 1000);
setTimeout(() => s2.emit(1), 6000);

setTimeout(() => {}, 1000000);
