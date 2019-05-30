import {userConstants} from '../constants';

let token = localStorage.getItem('accessToken') ? JSON.parse(localStorage.getItem('accessToken')) : null;

const initialState = token ? {
    type: userConstants.LOGIN_SUCCESS,
    loggedIn: true,
    token: token.accessToken,
    current_username: token.username
} : {
    type: userConstants.LOGIN_FAILURE
};

export function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                token: action.token,
                current_username: action.current_username
            };
        case userConstants.LOGIN_FAILURE:
            return {};
        case userConstants.LOGOUT:
            return {};
        default:
            return state
    }
}