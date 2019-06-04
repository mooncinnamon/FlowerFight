const express = require('express');
const router = express.Router();
const authJwt = require('./verifyJwtToken');
const date = require('date-utils');
const uuidV1 = require('uuid/v1');
const db = require('../config/db.config.js');
const GameInfo = db.gameInfo;

/*
  Todo : Room User List UPDATE
 */

const custonSort = (a, b) => {
    if (a.roomCreatAt === b.roomCreatAt) {
        return 0
    }
    return a.roomCreatAt > b.roomCreatAt ? 1 : -1;
};

const bettingDataInit = {
    'boardMoney': 0,
    'lastHalf': '',
    'count': 0,
    'callMoney': 0,
    'prevMoney': 0,
    'round': 'round1'
};

const lobby = (res, callback) => {
    const lobbyList = [];
    res.redis.keys("gameRoom:*", (err, keys) => {
        console.log('gameRoom', 'list', keys);
        if (keys.length !== 0) {
            keys.forEach((item, index, array) => {
                res.redis.hgetall(item, (err, results) => {
                    lobbyList.push(results);
                    if (index === array.length - 1)
                        callback(lobbyList);
                });
            });
        } else {
            callback(lobbyList);
        }
    });
};

// ::::/v1/room/make
router.post('/make', [authJwt.verifyToken], function (req, res, next) {
    // 정렬을 위한 지금 시간
    const clock = new Date();
    const uuid = uuidV1();

    //인자값 검사사
    if (!req.body["roomName"] || !req.body["roomMaster"]) {
        res.json({error: true});
        return
    }

    // 인자값 등록
    const user = req.body["roomMaster"];
    const data = {
        'roomId': uuid,
        'roomName': req.body["roomName"],
        'roomMaster': user,
        'roomCreatAt': clock
    };


    GameInfo.findOne({
        where: {username: user}
    }).then(info => {
            //리턴용 룸 정보
            const gameRoomData = Object.assign({}, data);
            gameRoomData[user] = info.money;
            const bettingData = Object.assign({}, bettingDataInit);
            bettingData[user] = 0;

            res.redis.hmset('gameRoom:' + uuid, gameRoomData);
            res.redis.hmset('bettingRoom:' + uuid, bettingData);
            console.log('room', 'post', 'make', data, '\ngameRoomData', gameRoomData, '\nbetting', bettingData);
            res.redis.hgetall('bettingRoom:' + uuid, (err, result) => {
                Object.keys(bettingDataInit).forEach(e => delete result[e]);
                gameRoomData['userList'] = Object.keys(result);
                gameRoomData['userMoneyList'] = result;
                res.json(gameRoomData);
            });
        }
    );
});

// ::::/v1/room/input
router.post('/input', [authJwt.verifyToken], function (req, res, next) {
    //인자값 검사자
    if (!req.body["roomId"] || !req.body['userName']) {
        res.json({result: false});
        return
    }

    // 인자 값 만들기
    const id = req.body["roomId"];
    const gameRoomid = "gameRoom:" + id;
    const bettingid = "bettingRoom:" + id;
    const username = req.body['userName'];

    const data = {
        'roomId': id,
    };
    GameInfo.findOne({
        where: {username: username}
    }).then(info => {
            res.redis.hget(gameRoomid, 'roomMaster', (err, result) => {
                //리턴용 룸 정보
                const roomData = Object.assign({}, data);
                roomData['roomMaster'] = result;
                roomData[username] = info.money;
                roomData['userList'] = [];

                // 새로운 유저 허가
                const usermoney = info.money;
                res.redis.hset(bettingid, username, 0);
                res.redis.hset(gameRoomid, username, usermoney);

                console.log('room', 'post', 'input', roomData);
                res.redis.hgetall(bettingid, (err, result) => {
                    roomData['userList'] = Object.keys(bettingDataInit).forEach(e => delete result[e]);
                    res.json(roomData);
                });
            });

        }
    );
});


// ::::/v1/room/list
router.get('/list', [authJwt.verifyToken], function (req, res, next) {
    lobby(res, (lobbyList) => {
        lobbyList.sort(custonSort);
        console.log(lobbyList);
        res.json({
            list: lobbyList
        });
    });
});

module.exports = router;
