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
(function () { return __awaiter(_this, void 0, void 0, function () {
    var select, fs;
    return __generator(this, function (_a) {
        try {
            select = {
                ok: new fetch_stream_2.FetchResponseStream()
                    .extractText().debug(function (data) {
                    var t = 5;
                }).map(function (data) { return data.substr(0, 10); }),
                error: new stream_1.Stream()
                    .map(function (data) { return 'not ok'; })
            };
            fs = fetch_stream_1.FetchStream.get('https://google.com', 'test')
                .select(function (response) { return response.ok ? 'ok' : 'error'; }, select);
            fs.subscribe(function (data) {
                console.log(data);
            }, function (err) {
                console.error('error', err);
            });
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
            //const s2 = new Stream<string>()
            //    .progressive()
            //    .reduce((a, d) => a + d, '')
            //    .debounce(.25)
            //    .map((d) => ':' + d + ':')
            //    .filter(':12345:');
            //
            //s2.subscribe((data) => console.log(data));
            //
            //const pause = (s) => new Promise((resolve) => setTimeout(resolve, s * 1000));
            //
            //s2.emit('1');
            //s2.emit('2');
            //
            //await pause(0.5);
            //
            //s2.emit('3');
            //s2.emit('4');
            //
            //await pause(0.5);
            //
            //s2.emit('5');
            //const ms = new MathStream();
            //
            //ms
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
            //;
            //
            //start();
            //
            //for (let i = 0; i < 10000000; i ++) {
            //   ms.emit(i);
            //}
            //
            //ms.prebuffer(5);
            //
            //ms.emit(1);
            //ms.emit(2);
            //ms.emit(3);
            //ms.emit(4);
            //ms.emit(5);
            //
            //stop('ok', 10000000);
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
        }
        catch (err) {
            console.error(err);
        }
        return [2 /*return*/];
    });
}); })();
setTimeout(function () { }, 60000000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUJBc09BOztBQXRPQSxtQ0FBZ0M7QUFNaEMscURBQWlEO0FBQ2pELHFEQUF5RDtBQUl6RCxJQUFJLElBQUksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO0FBRXJDO0lBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBRTlDLEVBQUUsQ0FBQyxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxHQUFHLFlBQVksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUM5QyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEIsQ0FBQztBQUVEO0lBQ0ksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEMsQ0FBQztBQUVELGNBQWMsS0FBSyxFQUFFLEdBQUc7SUFDcEIsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUU1QixZQUFZLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7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