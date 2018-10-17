"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("./stream");
var express_stream_1 = require("./extra/express_stream");
var time, timeSpentNew, timeSpentOld;
function percent() {
    console.log('==============================');
    if (timeSpentOld < timeSpentNew) {
        console.log((timeSpentNew / timeSpentOld * 100 - 100) + '% faster');
    }
    else {
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
//const w = new W3CWebsocketStream<any>('ws://127.0.0.1:9999/echo').filter((m) => m == "11" || m == "22");
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
(function () { return __awaiter(_this, void 0, void 0, function () {
    var sss, exp, router_1;
    return __generator(this, function (_a) {
        try {
            sss = new stream_1.Stream().map(function (d) { return d * 5; });
            sss.subscribe(function (d) { return console.log('1', d); });
            sss.subscribe(function (d) { return console.log('2', d); }).once().emit(2);
            exp = new express_stream_1.ExpressStream();
            exp.subscribe(function (msg) { return msg; });
            router_1 = exp.handle('/test').extractBody().extractForm().body(function (session, s) {
                s.error('error');
                //return 'ok!';
            }).jsonp();
            router_1.subscribe(router_1.jsonp.bind(router_1), function (e) {
                router_1.body(e).jsonp();
            });
            // router.subscribe(
            //     (session) => {
            //         console.log(session.body);
            //
            //         session.emit('123').complete();
            //     },
            //     (err) => {
            //
            //     }
            // );
            // router.subscribe((session) => null);
            exp.start(12345);
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
            //
            // select.ok.subscribe((data) => console.log('DATA!!!!'), () => console.log('ERRPR!!!'));
            //
            //  const fs = FetchStream.get<any>('https://google.com', 'test')
            //     .select((response) => response.ok ? 'ok' : 'error', select);
            //
            //  fs.subscribe((data) => {
            //     console.log(data);
            //  }, (err) => {
            //     console.error('error', err);
            //  });
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
            // const stor = new Storage(10, 1);
            //
            // start();
            //
            // for (let j = 0; j < 1000000; j += 1) {
            //    for (let i = 0; i < 10; i+= 1) {
            //        stor.add(i, 0);
            //    }
            //
            //    for (let i = 3; i < 9; i+= 1) {
            //        stor.delete(i, 0);
            //    }
            // }
            //
            // stop('ok', 1000000);
            //
            // console.log(stor);
            // const s2 = new Stream<string>()
            //    .progressive()
            //    .reduce((a, d) => a + d, '')
            //    .throttle(.25)
            //    .map((d) => ':' + d + ':');
            //
            // s2.subscribe((data) => console.log(data));
            //
            // const pause = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));
            //
            // s2.emit('1');
            // s2.emit('2');
            //
            // await pause(0.5);
            //
            // s2.emit('3');
            // s2.emit('4');
            //
            // await pause(0.5);
            //
            // s2.emit('5');
            //  const ms = new MathStream();
            //
            //  ms
            //     .progressive()
            //     .sum()
            //     .average()
            //     //.sqrt()
            //     .round();
            //  ;
            //
            // ms.subscribe((data) => {
            //     //console.log(`data: ${data}`);
            // }, (err) => {
            //     console.error(err);
            // });
            //
            // ms.subscribe((data) => {
            //     //console.log(`data: ${data}`);
            // }, (err) => {
            //     console.error(err);
            // });
            //
            //  start();
            //
            //  for (let i = 0; i < 3000000; i += 1) {
            //    ms.emit(i);
            //  }
            //
            //  ms.outBuffer(5);
            //
            //  ms.emit(1);
            //  ms.emit(2);
            //  ms.emit(3);
            //  ms.emit(4);
            //  ms.emit(5);
            //
            //  stop('ok', 3000000);
            //
            //  console.log(ms.lastValue);
            // start();
            //
            // const st = new Stream();
            // const s2 = st.debug((data) => data).debug((data) => data);
            //
            // for (let i = 0; i < 1000000; i += 1) {
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
        }
        catch (err) {
            console.error(err);
        }
        return [2 /*return*/];
    });
}); })();
setTimeout(function () { }, 60000000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBNFJBOztBQTVSQSxtQ0FBZ0M7QUFVaEMseURBQXFEO0FBRXJELElBQUksSUFBSSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7QUFFckM7SUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFFOUMsRUFBRSxDQUFDLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsQixDQUFDO0FBRUQ7SUFDSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNoQyxDQUFDO0FBRUQsY0FBYyxLQUFLLEVBQUUsR0FBRztJQUNwQixZQUFZLEdBQUcsWUFBWSxDQUFDO0lBRTVCLFlBQVksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUUzQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixPQUFPLENB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