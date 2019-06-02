const express = require('express');
const router = express.Router();
const authJwt = require('./verifyJwtToken');

/*
    Todo : select Starting Member; (Room master)
    Todo : How to Turn member;
    Todo : betting System
 */
const basicMoney = 10000;
const cardPull = ['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b',
    '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b'];

const readHashKey = (res, key, callback) => {
    res.redis.hgetall(key, (err, result) => {
        callback(result);
    })
};

const checkMaster = (res, key, user, callback) => {
    res.redis.hget(key, 'roomMaster', (err, result) => {
        console.log('checkMaster', result);
        callback(result === user);
    })
};

const setCardSet = (userList, deck, callback) => {
    const userCards = {};
    userList.forEach((item, index) => {
        userCards[item] = [];
        userCards[item].push(deck.pop());
        userCards[item].push(deck.pop());
        if (index === userList.length - 1)
            callback(userCards);
    });
};


// Hash Mset
const setHashMSetData = (res, key, data, callback) => {
    console.log('betting', 'basic', 'key', key, 'data', data);
    res.redis.hmset(key, data, () => {
        callback();
    });
};

const nextUser = (res, key, callback) => {
    res.redis.rpoplpush(key, key, () => {
        res.redis.lindex(key, -1, (err, result) => {
            callback(result)
        })
    })
};

const getHashData = (res, key, field, callback) => {
    console.log('list', 'get', 'id', key, 'username', field);
    res.redis.hget(key, field, (err, result) => {
        console.log('card', 'get', 'list', result);
        callback(result)
    })
};

const getHashMData = (res, key, field, callback) => {
    console.log('list', 'mget', 'id', key, 'field', field);
    res.redis.hmget(key, field, (err, result) => {
        console.log('result', result);
        callback(result);
    })
};

const getUser = (res, id, callback) => {
    console.log('cards', 'get', 'user',);
    res.redis.hkeys(id, (err, results) => {
        callback(results);
    })
};

const checkingFinished = (res, key, field, username, callback) => {
    console.log('check', 'Finish');
    getHashMData(res, key, field, (result) => {
        if (result[0] === username)
            if (result[1] === 'round2')
                callback({
                    result: true,
                    round: 'round2'
                });
            else {
                res.redis.hset(key, field[1], 'round2');
                callback({
                    result: false,
                    round: 'round2'
                });
            }
        else
            callback({
                result: false,
                round: 'round1'
            });
    });
};

// 카드 썩기
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// 게임 시작 시, 정보 저장 (카드 초기화 및, 손패 분배) 이후 소켓
router.post('/start', [authJwt.verifyToken], function (req, res, next) {
    console.log('game', 'start', 'list', req.body);

    let id = req.body.roomId;
    const username = req.body.username;
    const userList = req.body.userList.map(item => item.name);

    if (!id || !username || userList.length < 2) {
        res.json("error!");
        return
    }

    if (!id.startsWith('gameRoom:')) {
        id = 'gameRoom:' + id;
    }

    console.log('start', 'id', id, 'un', username, 'ul', userList);

    const userId = id.replace("gameRoom:", "userRoom:");
    const cardId = id.replace("gameRoom:", "cardRoom:");
    const bettingId = id.replace("gameRoom:", "bettingRoom:");

    res.redis.lpush(userId, userList);

    checkMaster(res, id, username, (result) => {
        if (result) {
            const shuffleDeck = shuffle(cardPull);
            console.log('id', cardId, 'deck', shuffleDeck);

            // 시작금 깍고 시작하기
            res.redis.hmget(id, userList, (err, result) => {
                console.log('id', id, 'result', result);
                const userSetStart = [];
                for (let i = 0; i < userList.length; i++) {
                    const userDataSet = {};
                    userSetStart[userList[i]] = Number(result[i]) - Number(basicMoney);
                    res.redis.hset(id, userList[i], Number(result[i]) - Number(basicMoney));
                }
            });
            // boardMoney 업데이트
            res.redis.hset(bettingId, 'boardMoney', Number(userList.length) * Number(basicMoney));
            //Card 뿌리기
            setCardSet(userList, shuffleDeck, (userCards) => {
                console.log('id', id, 'userCards', userCards);
                setHashMSetData(res, cardId, userCards, () => {
                    //User가 베팅할 수 있는 버튼 띄워주기
                    res.json(
                        {
                            user_betting: [1, 0, 0, 1]
                        }
                    );
                    res.io.to(id).emit('updateCards', id, username);
                })
            });
        } else {
            res.json({user_betting: [1, 1, 1, 1]})
        }
    });
});


// 손패 목록 불러오기 (자신을 제외한 나머지 사람들은 0a,0b)
router.get(`/user/card`, [authJwt.verifyToken], function (req, res, next) {
    console.log('game', 'user', 'card', req.query);
    let id = req.query.id;
    const username = req.query.username;

    //값 검증 해야한다.
    //역시 값 검증 들어갑니다.
    if (!id || !username) {
        res.json("error!");
        return
    }

    if (!id.startsWith('gameRoom:')) {
        id = 'gameRoom:' + id;
    }
    const cardId = id.replace("gameRoom:", "cardRoom:");
    getUser(res, cardId, (userList) => {
        const returnJson = [];
        getHashData(res, cardId, username, (cards) => {
            console.log('user', 'username', 'card', cards);
            userList.map((e) => {
                if (e === username)
                    returnJson.push({
                        "name": username,
                        "cards": cards.split(","),
                        "state": 0
                    });
                else
                    returnJson.push({
                        name: e,
                        cards: ['0a', '0b'],
                        state: 0
                    });
            });
            res.json(returnJson);
        });
    });
});


// 베팅 시스템 (수정해야 함)
router.post('/betting', function (req, res, next) {
    console.log('game', 'betting', req.body);

    let id = req.body.roomId;
    const sort = req.body.sort;
    const username = req.body.username;

    //역시 값 검증 들어갑니다.
    if (!id || !sort || !username) {
        res.json("error!");
        return
    }

    // 고유 아이디 뽑기
    if (!id.startsWith('gameRoom:')) {
        id = 'gameRoom:' + id;
    }

    const bettingId = id.replace("gameRoom:", "bettingRoom:");
    const userId = id.replace("gameRoom:", "userRoom:");

    // 먼저 판돈을 가져온다.
    // Edit!
    getHashMData(res, bettingId, ['boardMoney', 'callMoney', 'prevMoney', username], (dataSet) => {
        console.log('user', 'username', 'sort', sort, 'bettingId', bettingId,
            'betting', dataSet);

        const boardMoney = Number(dataSet[0]);
        let callMoney = Number(dataSet[1]);
        const prevMoney = Number(dataSet[2]);
        const userMoney = Number(dataSet[3]);
        let bettingMoney = 0;
        const resultBetting = {};
        // 0 : 콜, 1: 다이, 2: 하프, 3: 쿼터
        switch (sort) {
            case 'Call':
                bettingMoney = callMoney - userMoney;
                resultBetting['prevMoney'] = bettingMoney;
                resultBetting[username] = userMoney + bettingMoney;
                console.log('betting', 'Call', 'bettingMoney', bettingMoney, 'resultBetting', resultBetting);
                break;
            case 'Die':
                bettingMoney = 0;
                // bettingList에서 지우고
                // 마이너스로 해서 mysql 값 넣기
                break;
            case 'Half':
                if (callMoney === 0) {
                    bettingMoney = basicMoney / 2;
                } else {
                    bettingMoney = (boardMoney + prevMoney) / 2 + prevMoney;
                }
                resultBetting['callMoney'] = bettingMoney;
                callMoney = bettingMoney;
                resultBetting['lastHalf'] = username;
                resultBetting['prevMoney'] = bettingMoney;
                resultBetting[username] = userMoney + bettingMoney;
                console.log('betting', 'Half', 'bettingMoney', bettingMoney, 'resultBetting', resultBetting);
                break;
            case 'Quarter':
                bettingMoney = boardMoney / 4;
                resultBetting['prevMoney'] = bettingMoney;
                resultBetting[username] = userMoney + bettingMoney;
                console.log('betting', 'Quater', 'bettingMoney', bettingMoney, 'resultBetting', resultBetting);
                break;
        }
        // Count 횟수 올려주기
        res.redis.hget(bettingId, 'count', (err, result) => {
            res.redis.hset(bettingId, 'count', Number(result) + 1)
        });

        resultBetting['boardMoney'] = boardMoney + Number(bettingMoney);

        setHashMSetData(res, bettingId, resultBetting, () => {
            nextUser(res, userId, (next) => {
                console.log('user', 'betting', 'next', next);
                res.json({user_betting: [1, 1, 1, 1], money: boardMoney, callMoney: callMoney});
                res.io.to(id).emit('betting', boardMoney, username, sort, next);
            })
        });
    });
});


// 수정사항
// 전부 콜을 하고 2번째 판에 하프가 안됨
// 전부 콜을 한 상황에서는 2바퀴 돌아야 하는데 4바퀴 돔
router.get(`/betting/check`, [authJwt.verifyToken], function (req, res, next) {
    console.log('game', 'betting', 'check', req.query);
    let id = req.query.id;
    if (!id.startsWith('gameRoom:')) {
        id = 'gameRoom:' + id;
    }
    const username = req.query.username;
    const bettingId = id.replace("gameRoom:", "bettingRoom:");
    const userId = id.replace("gameRoom:", "userRoom:");

    res.redis.llen(userId, (err, userCount) => {
        res.redis.hget(bettingId, 'count', (err, result) => {
            checkingFinished(res, bettingId, ['lastHalf', 'round'], username, (isFinish) => {
                if (isFinish.result) {
                    res.json({
                        finish: true,
                        user_betting: [1, 1, 1, 1]
                    });
                } else {
                    const userN = Number(userCount);
                    const counter = Number(result);
                    const half = (counter / userN) + Number((isFinish.round === 'round2') ? 1 : 0);
                    const quater = ((counter / userN) % 2 + 1) % 2;
                    console.log('bettingState', 'round', isFinish.round, 'half', half, 'quater', quater);
                    const bettingState = [0, 0, Math.floor(half % 2), Math.floor(quater)];
                    res.json({
                        finish: false,
                        user_betting: bettingState
                    });
                }
            });
        });
    })
});


// User 목록 불러오기
router.get(`/user/list`, [authJwt.verifyToken], function (req, res, next) {
    console.log('game', 'user', 'list', req.query.id);
    let id = req.query.id;
    if (!id.startsWith('gameRoom:')) {
        id = 'gameRoom:' + id;
    }
    if (id) {
        readHashKey(res, id, (data) => {
            console.log('game', 'user', 'list', 'return', data);
            delete data.roomId;
            delete data.roomMaster;
            delete data.roomName;
            delete data.roomCreatAt;
            res.json(data);
        })
    } else {
        res.json({result: false});
    }
});


module.exports = router;
