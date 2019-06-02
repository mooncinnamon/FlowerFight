const express = require('express');
const router = express.Router();
const authJwt = require('./verifyJwtToken');
const date = require('date-utils');
const uuidV1 = require('uuid/v1');

/*
  Todo : Input Member Socket Room
  Todo : Room Making Save Redis
 */

const custonSort = (a, b) => {
    if (a.roomCreatAt === b.roomCreatAt) {
        return 0
    }
    return a.roomCreatAt > b.roomCreatAt ? 1 : -1;
}


const readKey = (res, callback) => {
    const data = [];
    res.redis.keys("gameRoom:*", (err, keys) => {
        console.log('redis', 'keys', keys);
        if (keys.length !== 0)
            keys.forEach((item, index, array) => {
                res.redis.hgetall(item, (err, results) => {
                    console.log('index', index, results);
                    const roomList = {
                        "roomId": results.roomId,
                        "roomName": results.roomName,
                        "roomMaster": results.roomMaster,
                        "roomCreatAt": results.roomCreatAt
                    };
                    data.push(roomList);
                    if (index === array.length - 1)
                        callback(data);
                })
            });
        else
            callback(
                []
            );
    });
};

const inputUser = (res, key, callback) => {
    res.redis.hlen(key, (err, number) => {
        callback(number + 1);
    })
};


// 여기서 방 만들고 redis 저장
router.post('/make', [authJwt.verifyToken], function (req, res, next) {
    console.log('room', 'making', 'post');
    const clock = new Date();

    if (!req.body["roomName"] || !req.body["roomMaster"]) {
        res.json("error!");
        return
    }
    const uuid = uuidV1();
    const member = req.body["roomMaster"];
    const data = {
        'roomId': uuid,
        'roomName': req.body["roomName"],
        'roomMaster': req.body["roomMaster"],
        'roomCreatAt': clock
    };

    data[member] = 100000000;

    res.redis.hmset('gameRoom:' + uuid, data);

    const bettingData = {
        'boardMoney': 0,
        'lastHalf': '',
        'count': 0,
        'callMoney': 0,
        'prevMoney': 0,
        'round': 'round1'
    };

    res.redis.hmset('bettingRoom:' + uuid, bettingData);

    console.log('room', 'post', 'make', data, 'betting', bettingData);
    delete data[member];
    res.json(data);
});

// 새로운 멤버가 추가된다.
router.post('/input', [authJwt.verifyToken], function (req, res, next) {
    console.log('room', 'input', 'post', res.body);

    if (!req.body["roomId"] || !req.body['userName']) {
        res.json({result: false});
        return
    }

    const id = "gameRoom:" + req.body["roomId"];
    const bettingid = "bettingRoom:" + req.body["roomId"];
    const username = req.body['userName'];
    const data = 100000000;

    // 새로운 유저 허가
    res.redis.hset(id, username, data);
    res.redis.hset(bettingid, username, 0);

    const roomData = {
        'roomId': id
    };
    roomData[username] = data;
    console.log('room', 'post', 'input', roomData);
    res.json(roomData);
});

router.get('/list', [authJwt.verifyToken], function (req, res, next) {
    readKey(res, (roomList) => {
        roomList.sort(custonSort);
        res.send(roomList);
    })
});

module.exports = router;
