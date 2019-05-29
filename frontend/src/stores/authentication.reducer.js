import {userConstants} from '../constants';

let token = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null;
const initialState = token ? {
    type: userConstants.LOGIN_SUCCESS,
    loggedIn: true,
    token: token
} : {
    type: userConstants.LOGIN_FAILURE
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                token: action.token
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}