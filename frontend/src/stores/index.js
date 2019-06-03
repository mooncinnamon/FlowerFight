import {combineReducers} from 'redux';
import {authentication} from './authentication.reducer';
import {lobby} from "./lobby.reducer";
import {token} from './users.reducer';
import {gameStore, bettingState, cardStore, bettingStore} from './game.reducer';

const rootReducer = combineReducers({
    authentication,
    lobby,
    token,
    gameStore,
    bettingState,
    cardStore,
    bettingStore
});

export default rootReducer;
