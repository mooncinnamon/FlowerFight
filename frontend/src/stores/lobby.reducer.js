import {lobbyConstants} from "../constants";


export function lobby(state = [], action) {
    switch (action.type) {
        case lobbyConstants.LOBBY_SUCCESS:
            return action.lobbyList;
        case lobbyConstants.LOBBY_FAILURE:
            return [];
        default:
            return state
    }
}