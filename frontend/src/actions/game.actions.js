import {gameService} from "../services/game.service";
import {gameConstants} from "../constants";

/*
 * action types
 */

export function loadUserList(id) {
    return dispatch => {
        gameService.loadUserList(id)
            .then(
                response => {
                    dispatch(success(response.data));
                },
                error => {
                    console.log('error', 'game', error);
                    dispatch(failure(error));
                }
            ).catch(err => {
            console.log('actions', 'game', 'error', err);
            dispatch(failure(err));
        })
    };

    function success(list) {
        console.log('actions', 'game', 'success', list);
        return {type: gameConstants.GAME_USER_LIST_SUCCESS, userList: list}
    }

    function failure(error) {
        console.log('actions', 'game', 'fail', error);
        return {type: gameConstants.GAME_USER_LIST_FAILURE, error}
    }
}

export function loadUserCards(id, username) {
    return dispatch => {
        gameService.loadUserCards(id, username)
            .then(
                res => {
                    console.log('action', 'game', 'onLoadUserCards', 'res', res);
                    dispatch(success(res))
                }
            ).catch(
            err => {
                console.log('action', 'game', 'onLoadUserCards', 'err', err);
                dispatch(failure(err))
            }
        );
    };

    function success(response) {
        console.log('actions', 'game', 'success', response);
        return {type: gameConstants.GAME_USER_CARD_SUCCESS, data: response}
    }

    function failure(error) {
        console.log('actions', 'game', 'fail', error);
        return {type: gameConstants.GAME_USER_CARD_FAILURE, error}
    }
}

export function onStart(id, username, userList) {
    return dispatch => {
        gameService.onStart(id, username, userList)
            .then(res => {
                    dispatch(success(res.data.user_betting))
                }
            ).catch(() => {
                dispatch(failure())
            }
        )
    };

    function success(res) {
        console.log('actions', 'game', 'success', res);
        return {type: gameConstants.GAME_ON_START_SUCCESS, betting: res}
    }

    function failure() {
        console.log('actions', 'game', 'fail');
        return {type: gameConstants.GAME_ON_START_FAILURE}
    }
}

export function setRoomId(id, master) {
    console.log('actions', 'game', 'setRoomId', id, 'master', master);
    return {type: gameConstants.GAME_ROOM_SET, roomId: id, roomMaster: master}
}

export function bettingCall(id, sort, username) {
    return dispatch => {
        gameService.betting(id, sort, username)
            .then(res => {
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

export function bettingDie(id, sort, username) {
    return dispatch => {
        gameService.betting(id, sort, username)
            .then(res => {
                dispatch(setMoney(res))
            })
            .catch(err => {
                    console.log(err);
                }
            );
    }
}

export function bettingHalf(id, sort, username) {
    return dispatch => {
        gameService.betting(id, sort, username)
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

export function bettingQuater(id, sort, username) {
    return dispatch => {
        gameService.betting(id, sort, username)
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
    console.log('money call', response);
    return {type: gameConstants.GAME_ON_BETTING, betting: response.user_betting, money: response.money}
}

function setBettingResult(boardMoney, username, userBettingSort) {
    console.log('setBettingResult', boardMoney, username, userBettingSort);
    return {
        type: gameConstants.BettingResult,
        boardMoney: boardMoney,
        username: username,
        userBettingSort: userBettingSort
    }
}

function onCheckBettiing(id, username) {
    console.log('onCheckBettiing', id, username);
    return dispatch =>
        gameService.bettingCheck(id, username)
            .then(res => {
                console.log('betting', res);
                dispatch(success(res));
            })
            .catch(err => {
                console.log('betting','err', err);
                    console.log(err);
                }
            );

    function success(res) {
        return {
            type: gameConstants.UPDATE_ON_BETTING,
            finish: res.finish,
            betting: res.user_betting
        }
    }
}

export const gameActions = {
    loadUserList,
    setRoomId,
    onStart,
    loadUserCards,
    bettingCall,
    bettingDie,
    bettingHalf,
    bettingQuater,
    setBettingResult,
    onCheckBettiing
};



