import {combineReducers} from 'redux';
import {authentication} from './authentication.reducer';
import {lobby} from "./lobby.reducer";
import {token} from './users.reducer';
import {chattingRoom} from './game.reducer';

const rootReducer = combineReducers({
    authentication,
    lobby,
    token,
    chattingRoom
});

export default rootReducer;
