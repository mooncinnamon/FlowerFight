const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const socket = require('socket.io');
const redis = require('redis');
const redisSocket = require('socket.io-redis');

const indexRouter = require('./routes/index');
const roomRouter = require('./routes/rooms');

const app = express();
const cors = require('cors');
const server = http.createServer(app);
const io = socket.listen(server);
const client = redis.createClient();
client.auth('1q2w3e4r');

app.use(cors());
/**
 *  Create Socket server
 */
io.adapter(redisSocket({
    host: 'localhost',
    port: 6379,
    password: '1q2w3e4r'
}));

// mount socket io
app.use(function (req, res, next) {
    res.io = io;
    next();
});

app.use(function (req, res, next) {
    res.redis = client;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/v1/room', roomRouter);
// catch 404 and forward to error handler

app.get('*', (req, res, next) => {
    if (req.path.split('/')[1] === 'static') return next();
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });


    socket.on('leaveRoom', (num, name) => {
        socket.leave(room[num], () => {
            console.log(name + ' leave a ' + room[num]);
            io.to(room[num]).emit('leaveRoom', num, name);
        });
    });


    socket.on('joinRoom', (roomMaster, name) => {
        console.log('joinRoom','call');
        socket.join(roomMaster, () => {
            console.log(name + ' join a ' + roomMaster);
            io.to(roomMaster).emit('joinRoom', roomMaster, name);
        });
    });


    socket.on('chat message', (roomMaster,  msg) => {
        io.to(roomMaster).emit('chat message',  msg);
    });
});



module.exports = {app: app, server: server};
