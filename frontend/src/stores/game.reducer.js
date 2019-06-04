import {gameConstants} from '../constants';

const initialState = {
    roomId: '',
    roomMaster: '',
    windUser: '',
    windMoney: 0,
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
            return Object.assign({}, initialState, {
                windUser: ''
            });
        // User 업데이트 (주로 들어올때 혹은 나갈때)
        case gameConstants.GAME_USER_LIST_UPDATE:
            return Object.assign({}, state, {
                userList: Object.keys(action.userList)
            });
        case gameConstants.UPDATE_MASTER:
            return Object.assign({}, state, {
                roomMaster: action.newMaster
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
                windUser: action.winUser,
                windMoney: action.winMoney
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
            return Object.assign({}, bettingInitialState,
                {
                    start: true,
                    bettingState: action.betting
                });
        case gameConstants.START_GAME:
            return Object.assign({}, bettingInitialState,
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
            return action.handCards;
        case gameConstants.GAME_USER_CARD_FAILURE:
            return state = {};
        case gameConstants.GAME_ON_FINISH:
            return state = action.handCardJson;
        default:
            return state
    }
}

// 베팅 결과
const bettingMoneyInitialState = {
    boardMoney: 0,
    callMoney: 0,
    userMoney: {},
    userBetting: {},
};

export function bettingStore(state = bettingMoneyInitialState, action) {
    switch (action.type) {
        // Game 시작시 판돈을 불러온다.
        case gameConstants.GAME_INSERT:
            return Object.assign({}, state, {
                userBetting: action.userMoneyList
            });
        case gameConstants.START_GAME:
            return Object.assign({}, bettingMoneyInitialState,
                {
                    boardMoney: action.boardMoney
                });
        case gameConstants.GAME_USER_LIST_UPDATE:
            return Object.assign({}, state, {
                userMoney: action.userList
            });
        case gameConstants.BETTING_RESULT:
            const usetBettingState = {};
            usetBettingState[action.username] = action.userBettingSort;
            return Object.assign({}, state, {
                boardMoney: action.boardMoney,
                callMoney: action.callMoney,
                userBetting: Object.assign({}, state.userBetting, usetBettingState)
            });
        case gameConstants.GAME_ON_FINISH :
            return Object.assign({}, state, {
                boardMoney:0,
                callMoney:0,
                userBetting: {}
            });
        default:
            return state
    }
}