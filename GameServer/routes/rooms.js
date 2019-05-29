const express = require('express');
const router = express.Router();
const date = require('date-utils');
/*
  Todo : Input Member Socket Room
  Todo : Room Making Save Redis
 */

const readKey = (res, callback) => {
    const data = [];
    res.redis.keys("roomDto*", (err, keys) => {
        console.log('redis', 'keys', keys);
        keys.forEach((item, index, array) => {
            res.redis.hgetall(item, (err, results) => {
                console.log('index', index, results);
                data.push(results);
                if (index === array.length - 1)
                    callback(data);
            })
        });
    });
};

const inputUser = (res, key, callback) => {
    res.redis.hlen(key, (err, number) => {
        callback(number + 1);
    })
};

/* GET users listing. */
router.get('/make', function (req, res, next) {
    console.log('room', 'making');

    res.send('respond with a resource');
});

// 여기서 방 만들고 redis 저장
router.post('/make', function (req, res, next) {
    console.log('room', 'making', 'post');
    const clock = new Date();
    console.log(req.body["roomId"]);
    if (!req.body["roomId"] || !req.body["roomName"] || !req.body["roomMaster"]) {
        res.json("error!");
        return
    }
    const data = {
        'roomName': req.body["roomName"],
        'roomMaster': req.body["roomMaster"],
        'roomCreatAt': clock.toFormat('YYYY-MM-DD- HH24:MI:SS'),
        'roomMember_0': req.body["roomMaster"]
    };

    res.redis.hmset('roomDto' + req.body["roomId"],
        data
    );


    res.json('success!');
});

router.post('/input', function (req, res, next) {
    console.log('room', 'input', 'post');

    if (!req.body["roomId"] || !req.body['userName']) {
        res.json('error');
        return
    }

    inputUser(res, req.body["roomId"], (num) => {
        const id = 'roomMember_' + num;
        res.redis.hset('roomDto' + req.body["roomId"], id, req.body['userName']);
        res.send(id);
    });
});

router.get('/list', function (req, res, next) {
    readKey(res, (data) => {
        res.send(data);
    })
});

module.exports = router;
