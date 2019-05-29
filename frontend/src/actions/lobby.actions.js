import {lobbyConstants} from '../constants';
import {lobbyService} from '../services';

export const lobbyActions = {
    getGameLobby,
    makeGame
};

function getGameLobby() {
    return dispatch => {
        lobbyService.getlobby()
            .then(
                lobbyList => {
                    console.log('loadLobby', 'success');
                    dispatch(setLobby(lobbyList));
                },
                error => {
                    console.log('loadLobby', 'error');
                    dispatch(failure(error));
                }
            )
    };

    function setLobby(lobby) {
        return {type: lobbyConstants.LOBBY_SUCCESS, lobbyList: lobby}
    }

    function failure(error) {
        return {type: lobbyConstants.LOBBY_FAILURE, error}
    }
}

function makeGame(user, history) {
    lobbyService.makeGame(user).then(
        history.push('/game')
    );
    return {type: lobbyConstants.GAME_MAKE}
}