import {lobbyConstants} from "../constants";


export function lobby(state = {lobby: []}, action) {
    console.log('action', 'lobby', action);
    switch (action.type) {
        case lobbyConstants.LOBBY_SUCCESS:
            return {lobby: action.lobbyList};
        case lobbyConstants.LOBBY_FAILURE:
            return {lobby: []};
        default:
            return state
    }
}