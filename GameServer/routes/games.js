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

const getHashAllData = (res, key, callback) => {
    res.redis.hgetall(key, (err, result) => {
        callback(result);
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

    getHashMData(res, key, field, (result) => {
        console.log('check', 'key', key, 'field', field, 'Finish', result);
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

    res.redis.hget(id, 'roomMaster', (err, result) => {
        while (userList[-1] === result) {
            const user = userList.shift();
            userList.push(user);

        }
        res.redis.lpush(userId, userList);
        console.log('lpush', 'userlit', userList);
    });


    checkMaster(res, id, username, (result) => {
        if (result) {
            const shuffleDeck = shuffle(cardPull);
            console.log('id', cardId, 'deck', shuffleDeck);

            // 시작금 깍고 시작하기
            res.redis.hmget(id, userList, (err, result) => {
                console.log('id', id, 'result', result);
                const userSetStart = [];
                for (let i = 0; i < userList.length; i++) {
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
                    res.json({
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
        console.log('user', username, 'sort', sort, 'bettingId', bettingId,
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
                // 마이너스로 해서 mysql 값 넣기
                console.log('betting', 'Call', 'bettingMoney', bettingMoney, 'resultBetting', resultBetting);
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
                if (sort === 'Die') {
                    // bettingList에서 지우고
                    res.redis.lrem(userId, 1, username);
                }
                console.log('user', 'betting', 'next', next);
                res.json({user_betting: [1, 1, 1, 1], money: boardMoney, callMoney: callMoney});
                res.io.to(id).emit('betting', boardMoney, username, sort, next);
            })
        });
    });
});


const cardResult = (a, b) => {
    const aMon = Number(a.slice(0, -1));
    const aSor = a.slice(-1);

    const bMon = Number(b.slice(0, -1));
    const bSor = b.slice(-1);

    if (((aMon === 3 || aMon === 8) && aSor === 'a') && ((bMon === 3 || bMon === 8) && bSor === 'a')) {
        return 30
    } else if (((aMon === 1 || aMon === 8) && aSor === 'a') && ((bMon === 1 || bMon === 8) && bSor === 'a')) {
        return 29
    } else if (((aMon === 3 || aMon === 1) && aSor === 'a') && ((bMon === 3 || bMon === 1) && bSor === 'a')) {
        return 28
    } else if (aMon === 10 && bMon === 10) {
        return 27
    } else if (aMon === 9 && bMon === 9) {
        return 26
    } else if (aMon === 8 && bMon === 8) {
        return 25
    } else if (aMon === 7 && bMon === 7) {
        return 24
    } else if (aMon === 6 && bMon === 6) {
        return 23
    } else if (aMon === 5 && bMon === 5) {
        return 22
    } else if (aMon === 4 && bMon === 4) {
        return 21
    } else if (aMon === 3 && bMon === 3) {
        return 20
    } else if (aMon === 2 && bMon === 2) {
        return 19
    } else if (aMon === 1 && bMon === 1) {
        return 18
    } else if ((aMon === 1 && bMon === 2) || (aMon === 2 && bMon === 1)) {
        return 17
    } else if ((aMon === 1 && bMon === 4) || (aMon === 4 && bMon === 1)) {
        return 16
    } else if ((aMon === 1 && bMon === 9) || (aMon === 9 && bMon === 1)) {
        return 15
    } else if ((aMon === 1 && bMon === 10) || (aMon === 10 && bMon === 1)) {
        return 14
    } else if ((aMon === 4 && bMon === 10) || (aMon === 10 && bMon === 4)) {
        return 13
    } else if ((aMon === 4 && bMon === 6) || (aMon === 6 && bMon === 4)) {
        return 12
    } else if ((aMon + bMon) % 10 === 9) {
        return 11
    } else if ((aMon + bMon) % 10 === 8) {
        return 10
    } else if ((aMon + bMon) % 10 === 7) {
        return 9
    } else if ((aMon + bMon) % 10 === 6) {
        return 8
    } else if ((aMon + bMon) % 10 === 5) {
        return 7
    } else if ((aMon + bMon) % 10 === 4) {
        return 6
    } else if ((aMon + bMon) % 10 === 3) {
        return 5
    } else if ((aMon + bMon) % 10 === 2) {
        return 4
    } else if ((aMon + bMon) % 10 === 1) {
        return 3
    } else if ((aMon + bMon) % 10 === 0) {
        return 2
    }
};

// 암행어사 = 'ab' , 땡잡이는 = 'ac', 멍텅구리 구사 = 'ad' 구사 = 'bc', 꽝 = 'ff'
const speicialCardResult = (a, b) => {
    const aMon = Number(a.slice(0, -1));
    const aSor = a.slice(-1);

    const bMon = Number(b.slice(0, -1));
    const bSor = b.slice(-1);

    if (((aMon === 4 || aMon === 7) && aSor === 'a') && (((bMon === 7 || bMon === 4) ** bSor === 'a'))) {
        return 'ab'
    } else if (((aMon === 3 || aMon === 7) && aSor === 'a') && (((bMon === 7 || bMon === 3) ** bSor === 'a'))) {
        return 'ac'
    } else if (((aMon === 4 || aMon === 9) && aSor === 'a') && (((bMon === 9 || bMon === 4) ** bSor === 'a'))) {
        return 'ad'
    } else if ((aMon === 4 && bMon === 9) || (aMon === 9 && bMon === 4)) {
        return 'bc'
    } else {
        return 'ff'
    }
};

// 특족 찾기
const finalResult = (result, specialArray) => {
    if (30 > result > 27 && specialArray.some(x => x === 'ab')) {
        return 'ab';
    } else if (27 > result > 17 && specialArray.some(x => x === 'ac')) {
        return 'ac';
    } else if (28 > result > 17 && specialArray.some(x => x === 'ad')) {
        return 'ad';
    } else if (18 > result && specialArray.some(x => x === 'bc')) {
        return 'bc';
    } else
        return result;
};

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
    const cardId = id.replace("gameRoom:", "cardRoom:");

    res.redis.llen(userId, (err, userCount) => {
        res.redis.hget(bettingId, 'count', (err, result) => {
            checkingFinished(res, bettingId, ['lastHalf', 'round'], username, (isFinish) => {
                if (isFinish.result) {
                    // 결 과 내 기
                    const cardResultArray = [];
                    const specialCardResultArray = [];

                    getHashAllData(res, cardId, (allData) => {
                        res.redis.lrange(userId, 0, -1, (err, users) => {
                            console.log('lrange', users, 'allData', allData);
                            const keySet = Object.keys(allData);
                            users.forEach((el) => {
                                const cards = allData[el];
                                const cardList = cards.split(',');
                                console.log('allData', allData, 'cards', cards, 'cardList', cardList);
                                cardResultArray.push(cardResult(cardList[0], cardList[1]));
                                specialCardResultArray.push(speicialCardResult(cardList[0], cardList[1]));
                            });
                            // 최댓값 찾기
                            const result = cardResultArray.reduce((previous, current) => {
                                return previous > current ? previous : current;
                            });
                            // 특수 족보 찾기
                            const final = finalResult(result, specialCardResultArray);
                            console.log('final', final);

                            // 데이터 지우기
                            res.redis.del(userId);
                            res.redis.del(cardId);
                            const bettingData = {
                                'boardMoney': 0,
                                'lastHalf': '',
                                'count': 0,
                                'callMoney': 0,
                                'prevMoney': 0,
                                'round': 'round1'
                            };
                            res.redis.hmset(bettingId, bettingData);

                            //아래에서 승자를 roomMaster로 바꿔주기
                            switch (final) {
                                case 'ab':
                                    const abKey = keySet[specialCardResultArray.indexOf('ab')];
                                    res.redis.hset(id, 'roomMaster', abKey);
                                    console.log(abKey);
                                    res.io.to(id).emit('finish', allData, abKey);
                                    res.json({
                                        winner: abKey,
                                        finish: true,
                                        user_betting: [1, 1, 1, 1]
                                    });
                                    break;
                                case 'ac':
                                    const acKey = keySet[specialCardResultArray.indexOf('ac')];
                                    res.redis.hset(id, 'roomMaster', acKey);
                                    console.log(acKey);
                                    res.io.to(id).emit('finish', allData, acKey);
                                    res.json({
                                        winner: acKey,
                                        finish: true,
                                        user_betting: [1, 1, 1, 1]
                                    });
                                    break;
                                default:
                                    const KKK = keySet[cardResultArray.indexOf(final)];
                                    res.redis.hset(id, 'roomMaster', KKK);
                                    console.log(KKK);
                                    res.io.to(id).emit('finish', allData, KKK);
                                    res.json({
                                        winner: KKK,
                                        finish: true,
                                        user_betting: [1, 1, 1, 1]
                                    });
                                    break;
                            }
                        });
                    });
                } else {
                    const userN = Number(userCount);
                    const counter = Number(result);
                    const half = (counter / userN) + Number((isFinish.round === 'round2') ? 1 : 0);
                    const quater = (isFinish.round === 'round2') ? ((counter / userN) % 2 + 1) % 2 : 1;
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
