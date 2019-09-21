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
var fetch_stream_1 = require("./extra/fetch_stream");
var fetch_stream_2 = require("./extra/fetch_stream");
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
    var sss, exp, router_1, select, fs;
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
            select = {
                ok: new fetch_stream_2.FetchResponseStream()
                    .extractJson().debug(function (data) {
                    var t = 5;
                }).map(function (data) { return data.substr(0, 10); }).debug(function (data) {
                    var t = 5;
                }),
                error: new stream_1.Stream()
                    .map(function (data) { return 'not ok'; })
            };
            select.ok.subscribe(function (data) { return console.log('DATA!!!!'); }, function () { return console.log('ERRPR!!!'); });
            fs = fetch_stream_1.FetchStream.get('https://google.com', 'test')
                .select(function (response) { return response.ok ? 'ok' : 'error'; }, select);
            fs.subscribe(function (data) {
                console.log(data);
            }, function (err) {
                console.error('error', err);
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBNFJBOztBQTVSQSxtQ0FBZ0M7QUFNaEMscURBQWlEO0FBQ2pELHFEQUF5RDtBQUd6RCx5REFBcUQ7QUFFckQsSUFBSSxJQUFJLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQztBQUVyQztJQUNJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUU5QyxFQUFFLENBQUMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDOUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLENBQUM7QUFFRDtJQUNJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2hDLENBQUM7QUFFRCxjQUFjLEtBQUssRUFBRSxHQUFHO0lBQ3BCLFlBQVksR0FBRyxZQUFZLENBQUM7SUFFNUIsWUFBWSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRTNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLEtB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