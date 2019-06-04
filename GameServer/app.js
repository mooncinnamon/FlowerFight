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
    const gameId = 'gameRoom:' + key;
    client.hget(gameId, 'roomMaster', (err, result) => {
        console.log('checkMaster', result);
        callback(result);
    })
};

const updateMaster = (key, user, callback) => {
    client.hset(key, 'roomMaster', user, (err, result) => {
        console.log('updateMaster', result);
        callback();
    })
};

const deleteMember = (key, user, callback) => {
    checkMaster(key, user, (master) => {
        const roomMaster = master;
        const gameId = "gameRoom:" + key;
        console.log('deleteMember', 'gameId', gameId, 'user', user);
        client.hdel(gameId, user, () => {
            countMember(gameId, (count) => {
                if (count <= 4) {
                    callback({NoUser:true, RoomMaster:false, NewMaster:undefined});
                } else {
                    console.log('user', user, 'roomMaster', roomMaster);
                    if (roomMaster === user)
                        getUser(gameId, (newMaster) => {
                            updateMaster(gameId, newMaster, ()=> {
                                callback({NoUser:false, RoomMaster:true , NewMaster:newMaster});
                            });
                        });
                    else
                        callback({NoUser:false, RoomMaster:false, NewMaster:undefined});
                }
            })
        });
        client.hdel("cardRoom:" + key, user);
        client.hdel("bettingRoom:" + key, user);
        client.lrem("userRoom:" + key, 1, user);
    });
};

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
        if (socket.roomid) {
            console.log('user disconnected', socket.roomid, socket.nickname);
            io.to(socket.roomid).emit('updateUser', socket.roomid, socket.nickname);
            deleteMember(socket.roomid, socket.nickname, (ifZero) => {
                console.log('deleteMember', ifZero);
                if (ifZero.NoUser) {
                    const gameId = "gameRoom:" + socket.roomid;
                    const cardId = "cardRoom:" + socket.roomid;
                    const bettingId = "bettingRoom:" + socket.roomid;
                    const userId = "userRoom:" + socket.roomid;
                    client.del(gameId, cardId, bettingId, userId);
                }
                if(ifZero.RoomMaster)
                    io.to(socket.roomid).emit('roomMasterUpdate', ifZero.NewMaster);
            })
        }
    });

    socket.on('leaveRoom', (roomId, name) => {
        socket.leave(roomId, () => {
            console.log(name + ' leave a ' + roomId);
            deleteMember(socket.roomid, socket.nickname, (ifZero) => {
                console.log('deleteMember', ifZero);
                if (ifZero) {
                    const gameId = "gameRoom:" + socket.roomid;
                    const cardId = "cardRoom:" + socket.roomid;
                    const bettingId = "bettingRoom:" + socket.roomid;
                    const userId = "userRoom:" + socket.roomid;
                    client.del(gameId, cardId, bettingId, userId);
                }
            });
            io.to(socket.roomid).emit('updateUser', socket.roomid, socket.nickname);
        });
    });

    socket.on('joinRoom', (roomId, name) => {
        console.log('joinRoom', 'call', roomId, 'name', name);
        socket.roomid = roomId;
        socket.nickname = name;
        socket.join(roomId, () => {
            console.log(name + ' join a ' + roomId);
            io.to(roomId).emit('updateUser', roomId);
        });
    });

    socket.on('chat message', (roomMaster, msg) => {
        io.to(roomMaster).emit('chat message', msg);
    });
});


module.exports = {app: app, server: server};
