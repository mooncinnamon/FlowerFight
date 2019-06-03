import {gameConstants} from '../constants';

const initialState = {
    roomId: '',
    roomMaster: '',
    windUser: '',
    userList: []
};

export function gameStore(state = initialState, action) {
    switch (action.type) {
        //방에 들어갔다!
        case gameConstants.GAME_INSERT:
            return Object.assign({}, state, {
                roomId: action.roomId,
                roomMaster: action.roomMaster,
                userList: action.userList
            });
        // 게임 시작
        case gameConstants.START_GAME:
            return Object.assign({}, state, {
                windUser: ''
            });
        // User 업데이트 (주로 들어올때 혹은 나갈때)
        case gameConstants.GAME_USER_LIST_UPDATE:
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
        case gameConstants.GAME_ON_FINISH:
            return Object.assign({}, state, {
                roomMaster: action.winUser,
                windUser: action.windUser
            });
        default:
            return state;
    }
}

// 버튼 컨트롤러
const bettingInitialState = {
    start: false,
    bettingState: [1, 1, 1, 1]
};

export function bettingState(state = bettingInitialState, action) {
    switch (action.type) {
        //게임을 시작했다.
        case gameConstants.GAME_ON_START_SUCCESS:
            return Object.assign({}, state,
                {
                    start: true,
                    bettingState: action.betting
                });
        case gameConstants.START_GAME:
            return Object.assign({}, state,
                {
                    start: true,
                    bettingState: action.betting
                });
        case gameConstants.USER_TURN:
            return Object.assign({}, state,
                {
                    bettingState: action.bettingState
                });
        // 베팅을 했을 때
        case gameConstants.GAME_ON_BETTING:
            return Object.assign({}, state,
                {
                    money: action.money,
                    bettingState: [1, 1, 1, 1]
                });
        case gameConstants.GAME_ON_FINISH:
            return bettingInitialState;
        case gameConstants.GAME_ON_START_FAILURE:
            return Object.assign({}, state,
                {
                    start: false,
                    bettingState: [1, 1, 1, 1]
                });
        default:
            return state
    }
}

// 유저들 카드 목록 (수정해야함)
export function cardStore(state = {}, action) {
    switch (action.type) {
        case gameConstants.GAME_USER_CARD_SUCCESS:
            return action.data;
        case gameConstants.GAME_USER_CARD_FAILURE:
            return state = {};
        case gameConstants.GAME_ON_FINISH:
            return state = {};
        default:
            return state
    }
}

// 베팅 결과
const bettingMoneyInitialState = {
    boardMoney: 0,
    callMoney: 0,
    userBetting: {}
};

export function bettingStore(state = bettingMoneyInitialState, action) {
    switch (action.type) {
        // Game 시작시 판돈을 불러온다.
        case gameConstants.START_GAME:
            return Object.assign({}, state,
                {
                    boardMoney: action.boardMoney
                });
        case gameConstants.BETTING_RESULT:
            const newState = Object.assign({}, state, {
                boardMoney: action.boardMoney,
                callMoney: action.callMoney
            });
            newState.userBetting[action.username] = action.userBettingSort;
            return newState;
        case gameConstants.GAME_ON_FINISH:
            return bettingMoneyInitialState;
        default:
            return state
    }
}