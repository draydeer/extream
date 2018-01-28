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
var math_stream_1 = require("./extra/math_stream");
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
    var ms, ii, i;
    return __generator(this, function (_a) {
        try {
            ms = new math_stream_1.MathStream();
            ii = 0;
            ms //.complex()
                .min()
                .subscribe(function (data) {
                //console.log(`data: ${data}`);
            }, function (err) {
                console.error(err);
            });
            start();
            for (i = 0; i < 1000000; i++) {
                ms.emit(i);
            }
            ms.emit(1);
            ms.emit(2);
            ms.emit(3);
            ms.emit(4);
            ms.emit(5);
            stop('ok', 1000000);
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
