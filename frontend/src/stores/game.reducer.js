import {gameConstants} from '../constants';

const initialState = {
    roomId: '',
    roomMaster: '',
    userList: []
};

export function gameInfomation(state = initialState, action) {
    switch (action.type) {
        case gameConstants.GAME_USER_LIST_SUCCESS:
            return Object.assign({}, state, {
                userList: action.userList
            });
        case gameConstants.GAME_ROOM_SET:
            return Object.assign({}, state, {
                roomId: action.roomId,
                roomMaster: action.roomMaster,
            });
        case gameConstants.GAME_USER_LIST_FAILURE:
            return Object.assign({}, state, {
                userList: []
            });

        default:
            return state;
    }
}

export function bettingState(state = {
    money: 0,
    start: false,
    bettingState: [1, 1, 1, 1]
}, action) {
    switch (action.type) {
        case gameConstants.GAME_ON_START_SUCCESS:
            return Object.assign({}, state,
                {
                    start: true,
                    bettingState: action.betting
                });
        case gameConstants.GAME_ON_START_FAILURE:
            return Object.assign({}, state,
                {
                    start: false,
                    bettingState: [1, 1, 1, 1]
                });
        case gameConstants.GAME_ON_BETTING:
            return Object.assign({}, state,
                {
                    money: action.money,
                    bettingState: action.betting
                });
        case gameConstants.UPDATE_ON_BETTING:
            return Object.assign({}, state, {
                start: !action.finish,
                bettingState: action.betting
            });
        default:
            return state
    }
}


export function cards(state = [], action) {
    console.log('run', 'cards', action);
    switch (action.type) {
        case gameConstants.GAME_USER_CARD_SUCCESS:
            return action.data;
        case gameConstants.GAME_USER_CARD_FAILURE:
            return state = [];
        default:
            return state
    }
}

export function bettingResult(state = {'boardMoney': 0}, action) {
    console.log('store', 'bettingResult', action);
    switch (action.type) {
        case gameConstants.BettingResult:
            const data = Object.assign({}, state);
            data['boardMoney'] = action.boardMoney;
            data[action.username] = action.userBettingSort;
            return data;
        default:
            return state
    }
}