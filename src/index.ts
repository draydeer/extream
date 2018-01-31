import {Stream} from "./stream";
import {WebsocketW3CWebsocketStream} from "./extra/websocket_w3cwebsocket_stream";
import {Executor} from "./executor";
import {Delegate} from "./delegate";
import {IntervalStream} from "./extra/interval_stream";
import {CyclicBuffer} from './buffer';
import {FetchStream} from './extra/fetch_stream';
import {FetchResponseStream} from "./extra/fetch_stream";
import {MathStream} from "./extra/math_stream";
import {Storage} from './storage';

let time, timeSpentNew, timeSpentOld;

function percent() {
    console.log('==============================');

    if (timeSpentOld < timeSpentNew) {
        console.log((timeSpentNew / timeSpentOld * 100 - 100) + '% faster');
    } else {
        console.log((timeSpentOld / timeSpentNew * 100 - 100) + '% slower');
    }

    console.log('==============================');
    console.log();
}

function start() {
    time = new Date().getTime();
}

function stop(title, ops) {
    timeSpentOld = timeSpentNew;

    timeSpentNew = new Date().getTime() - time;

    console.log('------------------------------');
    console.info(title);
    console.log();
    console.log('Total ops.: ' + ops);
    console.log('Time spent: ' + timeSpentNew + ' ms');
    console.log('Ops. per second: ' + (1000 / timeSpentNew * ops));
    console.log('Time per single op.: ' + (timeSpentNew / ops) + ' ms');
    console.log();
}

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
    try {
          // const select = {
          //     ok: new FetchResponseStream<any>()
          //         .extractText().debug((data) => {
          //             const t = 5;
          //         }).map((data) => data.substr(0, 10)).debug((data) => {
          //             const t = 5;
          //         }),
          //     error: new Stream<any>()
          //         .map((data) => 'not ok')
          // };

           // const fs = FetchStream.get<any>('https://google.com', 'test')
           //    .select((response) => response.ok ? 'ok' : 'error', select);
           //
           // fs.subscribe((data) => {
           //    console.log(data);
           // }, (err) => {
           //    console.error('error', err);
           // });

        // const fs = FetchStream.get<any>('https://google.com', 'test')
        //     .redirect((response) => response.ok ? 'ok' : 'error', select);
        //
        // Stream.merge(select.ok, select.error).subscribe((data) => {
        //     console.log(data);
        // }, (err) => {
        //     console.error('error', err);
        // });

        //const gg = new FetchResponseStream<any>().debug((data) => {
        //    const g = 5;
        //}).map((data) => Promise.resolve(data * 2)).debug((data) => {
        //    const g = 5;
        //});
        //
        //gg.subscribe((data) => console.log(data));
        //
        //gg.root.emit(1);

        // const ms = new MathStream();
        //
        // ms.progressive().sum().average().subscribe((data) => console.log(data));
        //
        // ms.emit(1);
        // ms.emit(2);
        // ms.emit(3);

         //const stor = new Storage();
         //
         //start();
         //
         //for (let j = 0; j < 1000000; j ++) {
         //    for (let i = 0; i < 10; i++) {
         //        stor.add(i);
         //    }
         //
         //    for (let i = 3; i < 9; i++) {
         //        stor.delete(i);
         //    }
         //}
         //
         //stop('ok', 1000000);
         //
         //console.log(stor);

        const s2 = new Stream<string>()
           .progressive()
           .reduce((a, d) => a + d, '')
           .debounce(.25)
           .map((d) => ':' + d + ':');

        s2.subscribe((data) => console.log(data));

        const pause = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));

        s2.emit('1');
        s2.emit('2');

        await pause(0.5);

        s2.emit('3');
        s2.emit('4');

        await pause(0.5);

        s2.emit('5');

         // const ms = new MathStream();
         //
         // ms
         //    .progressive()
         //    .sum()
         //    .average()
         //    // .sqrt()
         //    // .round()
         //    .subscribe((data) => {
         //        //console.log(`data: ${data}`);
         //    }, (err) => {
         //        console.error(err);
         //    });
         // ;
         //
         // start();
         //
         // for (let i = 0; i < 30000000; i ++) {
         //   ms.emit(i);
         // }
         //
         // ms.prebuffer(5);
         //
         // ms.emit(1);
         // ms.emit(2);
         // ms.emit(3);
         // ms.emit(4);
         // ms.emit(5);
         //
         // stop('ok', 30000000);

        // start();
        //
        // const st = new Stream();
        // const s2 = st.debug((data) => data).debug((data) => data);
        //
        // for (let i = 0; i < 1000000; i ++) {
        //     st.emit(i);
        // }
        //
        // stop('ok', 1000000);

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
    } catch (err) {
        console.error(err);
    }
})();

setTimeout(() => {}, 60000000);
