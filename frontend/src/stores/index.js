import {combineReducers} from 'redux';
import {authentication} from './authentication.reducer';
import {lobby} from "./lobby.reducer";
import {token} from './users.reducer';
import {gameInfomation, bettingState, cards, bettingResult} from './game.reducer';

const rootReducer = combineReducers({
    authentication,
    lobby,
    token,
    gameInfomation,
    bettingState,
    cards,
    bettingResult
});

export default rootReducer;
