import {lobbyConstants} from '../constants';
import {lobbyService} from '../services';

export const lobbyActions = {
    loadGameLobby,
    insertGame,
    makeGame
};

function loadGameLobby() {
    return dispatch => {
        lobbyService.loadLobby()
            .then(
                lobbyList => {
                    dispatch(setLobby(lobbyList));
                },
                error => {
                    dispatch(failure(error));
                }
            )
    };

    function setLobby(lobby) {
        console.log('actions', 'lobby', 'success', lobby);
        return {type: lobbyConstants.LOBBY_SUCCESS, lobbyList: lobby}
    }

    function failure(error) {
        console.log('actions', 'lobby', 'failure', error);
        return {type: lobbyConstants.LOBBY_FAILURE, error}
    }
}

function makeGame(user, history) {
    return dispatch => {
        lobbyService.makeGame(user)
            .then(roomData => {
                console.log('actions', 'lobby', 'makeGame', 'then', roomData);
                dispatch(makeSuccess());
                history.replace({
                    pathname: '/game',
                    state: roomData
                });
            }).catch(
            err => {
                console.log(err);
                dispatch(failuer())
            });
    }

    function makeSuccess() {
        return {type: lobbyConstants.GAME_MAKE}
    }

    function failuer() {
        return {type: lobbyConstants.GAME_MAKE_FAIL}
    }

}

function insertGame(user, history) {
    return dispatch => {
        lobbyService.insertGame(user)
            .then(userData => {
                console.log('actions', 'lobby', 'inserGame', userData);
                dispatch(inputSuccess());
                history.replace({
                    pathname: '/game',
                    state: userData
                });
            }).catch(
            err => {
                console.log(err);
                dispatch(failuer())
            });
    }

    function inputSuccess() {
        return {type: lobbyConstants.GAME_INSERT}
    }

    function failuer() {
        return {type: lobbyConstants.GAME_INSERT_FAIL}
    }
}