import {RECV_MESSAGE} from "../actions";

const initialState = {
    chatting: ''
};

export function chattingRoom(state = initialState, action) {
    switch (action.type) {
        case RECV_MESSAGE:
            return {...state, chatting: state.chatting.concat(action.data, '\n')};
        default:
            return state;
    }

}

