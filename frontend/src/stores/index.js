import {combineReducers} from 'redux';
import {authentication} from './authentication.reducer';
import {lobby} from "./lobby.reducer";
import {token} from './users.reducer';

const rootReducer = combineReducers({
    authentication,
    lobby,
    token
});

export default rootReducer;
