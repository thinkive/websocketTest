'use strict';

const session = require('express-session');
const express = require('express');
const http = require('http');
const uuid = require('uuid');
const url = require('url');
var WebSocket = require('ws')
const app = express();

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

//
// Serve static files from the 'public' folder.
//
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", '3.2.1')
    res.header("Connection", 'Upgrade')
    res.header("Content-Type", "application/json;charset=utf-8")
    next();
};
app.use(allowCrossDomain);//运用跨域的中间件
app.use(express.static('public'));
app.use(sessionParser);

app.post('/login', (req, res) => {
    //
    // "Log in" user and set userId to session.
    //
    const id = uuid.v4();

    console.log(`Updating session for user ${id}`);
    req.session.userId = id;
    res.send({ result: 'OK', message: 'Session updated' });
});

app.delete('/logout', (request, response) => {
    console.log('Destroying session');
    request.session.destroy();
    response.send({ result: 'OK', message: 'Session destroyed' });
});

//
// Create HTTP server by ourselves.
//
const server = http.createServer(app);
const wss = new WebSocket.Server({
    verifyClient: (info, done) => {
        console.log('Parsing session from request...');

        sessionParser(info.req, {}, () => {
            console.log('Session is parsed!');

            //
            // We can reject the connection by returning false to done(). For example,
            // reject here if user is unknown.
            //
            console.log(info.req.session.userId)
            done(info.req.session.userId);
        });
    },
    server
});
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
    // 接收客户端发送的消息
    ws.on('message', function incoming(message) {
        ws.isAlive = true;
        ws.on('pong', heartbeat)
        console.log('received: %s', message);
        console.log(`WS message ${message} from user ${req.session ? req.session.userId: 1}`);
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

//
// Start the server.
//
server.listen(8080, () => console.log('Listening on http://localhost:8080'));