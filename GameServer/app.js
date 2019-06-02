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
const gameRouter = require('./routes/games');

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
app.use('/v1/game', gameRouter);
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

const getUser = (key, callback) => {
    client.hkeys(key, (err, keyList) => {
        console.log('getUser', keyList);
        callback(keyList[4]);
    })
};

const countMember = (key, callback) => {
    client.hlen(key, (err, result) => {
        console.log('countMember', result);
        callback(result);
    })
};

const checkMaster = (key, user, callback) => {
    client.hget(key, 'roomMaster', (err, result) => {
        console.log('checkMaster', result);
        callback(result);
    })
};

const updateMaster = (key, user, callback) => {
    client.hset(key, 'roomMaster', user, (err, result) => {
        console.log('updateMaster', result);
        callback(false);
    })
};

const deleteMember = (key, user, callback) => {
    checkMaster(key, user, (master) => {
        const roomMaster = master;
        client.hdel(key, user, () => {
            countMember(key, (count) => {
                if (count <= 4) {
                    callback(true);
                } else {
                    console.log('user', user, 'roomMaster', roomMaster);
                    if (roomMaster === user)
                        getUser(key, (newMaster) => {
                            updateMaster(key, newMaster, callback);
                        });
                    else
                        callback(false);
                }
            })
        });
        client.hdel(key.replace("gameRoom:", "cardRoom:"), user);
        client.hdel(key.replace("gameRoom:", "bettingRoom:"), user);
        client.lrem(key.replace("gameRoom:", "userRoom:"), 1, user);
    });
};

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        if (socket.roomid) {
            console.log('user disconnected', socket.roomid, socket.nickname);
            io.to(socket.roomid).emit('updateUser', socket.roomid, socket.nickname);
            deleteMember(socket.roomid, socket.nickname, (count) => {
                console.log('deleteMember', count);
                if (count) {
                    client.del(socket.roomid);
                    client.del(socket.roomid.replace("gameRoom:", "cardRoom:"));
                    client.del(socket.roomid.replace("gameRoom:", "bettingRoom:"));
                    client.del(socket.roomid.replace("gameRoom:", "userRoom:"))
                }
            })
        }
    });

    socket.on('leaveRoom', (roomId, name) => {
        socket.leave(roomId, () => {
            console.log(name + ' leave a ' + roomId);
            io.to(socket.roomid).emit('updateUser', socket.roomid, socket.nickname);
            deleteMember(socket.roomid, socket.nickname ,(count)=>{
                console.log('deleteMember', count);
                if (count) {
                    client.del(socket.roomid);
                    client.del(socket.roomid.replace("gameRoom:", "cardRoom:"));
                    client.del(socket.roomid.replace("gameRoom:", "bettingRoom:"));
                    client.del(socket.roomid.replace("gameRoom:", "userRoom:"))
                }
            });
        });
    });

    socket.on('joinRoom', (roomId, name) => {

        if (!roomId.startsWith('gameRoom:')) {
            roomId = 'gameRoom:' + roomId;
        }

        console.log('joinRoom', 'call', roomId);
        socket.roomid = roomId;
        socket.nickname = name;
        socket.join(roomId, () => {
            console.log(name + ' join a ' + roomId);
            console.log('room', 'info', Object.keys(socket.rooms));
            io.to(roomId).emit('updateUser', roomId, name);
        });
    });

    socket.on('chat message', (roomMaster, msg) => {
        io.to(roomMaster).emit('chat message', msg);
    });
});


module.exports = {app: app, server: server};
