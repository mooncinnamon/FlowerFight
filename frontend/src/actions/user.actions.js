import {userConstants} from '../constants';
import {userService} from '../services';

export const userActions = {
    login,
    logout
};


function login(username, password) {
    return dispatch => {
         userService.login(username, password)
             .then(
                token => {
                    console.log('user actions', token);
                    dispatch(success(token));
                },
                error => {
                    console.log('user error', error);
                    dispatch(failure(error));
                }
            );
    };

    function success(token) {
        return {type: userConstants.LOGIN_SUCCESS, accessToken : token}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}


function logout() {
    userService.logout();
    return {type: userConstants.LOGOUT};
}