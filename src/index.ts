import {Stream} from "./stream";

var WebSocketClient = require('websocket').w3cwebsocket;

//const s = new Stream<any>();
//console.log(WebSockets);
//s.filter((d) => d == 1).timeout(2000);
//
//s.subscribe((d) => console.log(d));
//s.fork().filter((d) => d === 1).subscribe((d) => console.log('once' + d)).once();
//
//setTimeout(() => s.emit('1'), 0);
//setTimeout(() => s.emit('1'), 1000);
//
//setTimeout(() => {
//
//}, 10000);

const s = new Stream<any>((stream) => {
    var client = new WebSocketClient('ws://127.0.0.1:5004/counter');

    client.onerror = stream.error.bind(stream);

    stream.pause();

    client.onopen = function() {
        console.log('WebSocket Client Connected');

        function sendNumber() {
            if (client.readyState === client.OPEN) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                client.send(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        sendNumber();
    };

    client.onclose = stream.complete.bind(stream);

    client.onmessage = stream.emit.bind(stream);
});
