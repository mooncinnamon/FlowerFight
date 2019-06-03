import {gameService} from "../services/game.service";
import {gameConstants} from "../constants";

/*
 * action types
 */

//User 목록 불러오기 (Socket이 호출)
export function loadUserList(id) {
    return dispatch => {
        gameService.loadUserList(id)
            .then(
                userList => {
                    dispatch(success(userList));
                }
            ).catch(err => {
            dispatch(failure(err));
        })
    };

    function success(list) {
        console.log('actions', 'game', 'loadUserList', 'success', list);
        return {type: gameConstants.GAME_USER_LIST_UPDATE, userList: list}
    }

    function failure(error) {
        console.log('actions', 'game', 'loadUserList', 'error', error);
        return {type: gameConstants.GAME_USER_LIST_FAILURE, error}
    }
}


// Game 시작버튼 눌렀을때.
export function onStart(id, username) {
    return dispatch => {
        gameService.onStart(id, username)
            .then(response => {
                    dispatch(success(response))
                }
            ).catch(() => {
                dispatch(failure())
            }
        )
    };

    function success(res) {
        console.log('actions', 'game', 'onStart', 'success', res);
        return {type: gameConstants.GAME_ON_START_SUCCESS, betting: res.bettingState}
    }

    function failure() {
        console.log('actions', 'game', 'onStart', 'fail');
        return {type: gameConstants.GAME_ON_START_FAILURE}
    }
}

// Socket이 불러주는 호출
export function startGame(id, username) {
    return dispatch => {
        gameService.onStart(id, username)
            .then(response => {
                    dispatch(success(response))
                }
            ).catch(() => {
                dispatch(failure())
            }
        )
    };

    function success(res) {
        console.log('actions', 'game', 'onStart', 'success', res);
        return {type: gameConstants.START_GAME, baordMoney: res.boardMoney, handCards: res.handCards}
    }

    function failure() {
        console.log('actions', 'game', 'onStart', 'fail');
        return {type: gameConstants.GAME_ON_START_FAILURE}
    }
}

export function updateBettingState(id, username) {
    return dispatch => {
        gameService.bettingCheck(id, username)
            .then(res => {
                dispatch(success(res));
            }).catch((err) => {
            dispatch(failure());
        })
    };

    function success(res) {
        console.log('actions', 'game', 'updateBettingState', 'success', res);
        return {type: gameConstants.USER_TURN, bettingState: res.bettingState}
    }

    function failure() {
        console.log('actions', 'game', 'updateBettingState', 'fail');
        return {type: gameConstants.GAME_ON_START_FAILURE}
    }
}

/**
 * @param id
 * @param username
 * @returns {Function}
 *
 * handCards = {
 *     userName1 : [0a ,0b],
 *     userName1 : [0a ,0b],
 *     userName1 : [0a ,0b],
 *     userName1 : [0a ,0b],
 *     userName1 : [0a ,0b]
 * }
 */
// 전체 유저들의 카드를 불러오기
// Game 종료시 Socket이 호출
export function loadUserCards(id, username) {
    return dispatch => {
        gameService.loadUserCards(id, username)
            .then(res => {
                    dispatch(success(res))
                }
            ).catch(err => {
                dispatch(failure(err))
            }
        );
    };

    function success(res) {
        console.log('actions', 'game', 'loadUserCards', 'success', res);
        return {type: gameConstants.GAME_USER_CARD_SUCCESS, handCards: res.handCards}
    }

    function failure(error) {
        console.log('actions', 'game', 'loadUserCards', 'error', error);
        return {type: gameConstants.GAME_USER_CARD_FAILURE, error}
    }
}

// 임시로 안쓰는 함수
/*
export function setRoomId(id, master) {
    console.log('actions', 'game', 'setRoomId', id, 'master', master);
    return {type: gameConstants.GAME_ROOM_SET, roomId: id, roomMaster: master}
}
*/

// 여기서 부터는 베팅 Action(귀찮아서 하드코딩)
export function bettingCall(id, username) {
    return dispatch => {
        gameService.betting(id, 'Call', username)
            .then(res => {
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

export function bettingDie(id, username) {
    return dispatch => {
        gameService.betting(id, 'Die', username)
            .then(res => {
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

export function bettingHalf(id, username) {
    return dispatch => {
        gameService.betting(id, 'Half', username)
            .then(res => {
                console.log('betting', res);
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

export function bettingQuater(id, username) {
    return dispatch => {
        gameService.betting(id, 'Quarter', username)
            .then(res => {
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

function setMoney(response) {
    console.log('actions', 'game', 'loadUserCards', 'error', response);
    return {type: gameConstants.GAME_ON_BETTING, money: response.money}
}

// Socket이 직접호출
export function updateBettingResult(boardMoney, callMoney, username, userBettingSort) {
    console.log('actions', 'game', 'updateBettingResult', 'boardMoney', boardMoney, 'callMoney', callMoney, 'username', username, 'userBettingSort', userBettingSort);
    return {
        type: gameConstants.BETTING_RESULT,
        boardMoney: boardMoney,
        callMoney: callMoney,
        username: username,
        userBettingSort: userBettingSort
    }
}

// Socket이 직접호출
export function gameFinishResult(winUser) {
    console.log('actions', 'game', 'updateBettingResult', 'winUser', winUser);
    return {
        type: gameConstants.GAME_ON_FINISH,
        winUser: winUser
    }
}

export const gameActions = {
    loadUserList,
    onStart,
    startGame,
    loadUserCards,
    updateBettingState,
    bettingCall,
    bettingDie,
    bettingHalf,
    bettingQuater,
    updateBettingResult,
    gameFinishResult
};



