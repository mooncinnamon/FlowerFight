import {gameConstants, lobbyConstants} from '../constants';
import {lobbyService} from '../services';

export const lobbyActions = {
    loadGameLobby,
    insertGame,
    makeGame
};

// loadLobby 불러오기
function loadGameLobby() {
    return dispatch => {
        lobbyService.loadLobby()
            .then(lobbyList => {
                    dispatch(success(lobbyList));
                }
            ).catch(error => {
            dispatch(failure(error))
        })
    };

    function success(lobbyList) {
        console.log('actions', 'lobby', 'success', lobbyList);
        return {type: lobbyConstants.LOBBY_SUCCESS, lobbyList: lobbyList.list}
    }

    function failure(error) {
        console.log('actions', 'lobby', 'failure', error);
        return {type: lobbyConstants.LOBBY_FAILURE, error}
    }
}

// Room만들기
function makeGame(roomname, username, history) {
    return dispatch => {
        lobbyService.makeGame(roomname, username)
            .then(roomData => {
                dispatch(success(roomData));
                history.replace({
                    pathname: '/game',
                    state: {roomId: roomData.roomId}
                });
            }).catch(
            err => {
                dispatch(failure(err))
            });
    };

    function success(data) {
        console.log('actions', 'lobby', 'makeGame', 'success', data);
        return {
            type: gameConstants.GAME_INSERT,
            roomId: data.roomId,
            roomMaster: data.roomMaster,
            userList: data.userList,
            userMoneyList: data.userMoneyList
        }
    }

    function failure(error) {
        console.log('actions', 'lobby', 'makeGame', 'error', error);
        return {type: lobbyConstants.GAME_INSERT_FAIL, error}
    }

}

// 방에 들어가기
function insertGame(id, username, history) {
    return dispatch => {
        lobbyService.insertGame(id, username)
            .then(roomData => {
                dispatch(success(roomData));
                history.replace({
                    pathname: '/game',
                    state: {roomId: roomData.roomId}
                });
            }).catch(
            err => {
                dispatch(failure(err));
            });
    };

    function success(data) {
        console.log('actions', 'lobby', 'inserGame', 'success', data);
        return {
            type: gameConstants.GAME_INSERT,
            roomId: data.roomId,
            roomMaster: data.roomMaster,
            userList: data.userList
        }
    }

    function failure(error) {
        console.log('actions', 'lobby', 'inserGame', 'error', error);
        return {type: lobbyConstants.GAME_INSERT_FAIL, error}
    }
}