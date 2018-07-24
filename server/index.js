'use strict'
var express = require('express');
const http = require('http');
const server = http.createServer();
var app = express();
var port = 8080;
var url = require('url');
var WebSocket = require('ws')
const wss = new WebSocket.Server({noServer: true ,
    perMessageDeflate: {
        zlibDeflateOptions: { // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        clientMaxWindowBits: 10,       // Defaults to negotiated value.
        serverMaxWindowBits: 10,       // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10,          // Limits zlib concurrency for perf.
        threshold: 1024,               // Size (in bytes) below which messages
                                       // should not be compressed.
    }});
function noop() {}

function heartbeat() {
    this.isAlive = true;
}
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);
wss.on('connection', function connection(ws, req) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    const ip = req.connection.remoteAddress ||  req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
    console.log(ip)
    // 接收客户端发送的消息
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.on('open', () => {
        console.log('open');
        setTimeout(() => ws.terminate(), 10);
    });
    ws.on('error',function(){
        console.log("error");
    });
    ws.on('close', function close() {
        console.log('disconnected');
    });
    ws.send('something');
});


// Broadcast to all.
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};
server.on('upgrade', function upgrade(request, socket, head) {
    console.log(request.url)
    const pathname = url.parse(request.url).pathname;
    if (pathname === '/') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            console.log('server---------------->client')
            wss.emit('connection', ws, request);
            wss.broadcast('test')
        });
    } else {
        socket.destroy();
    }
});

server.listen(8080);