import {userConstants} from '../constants';
import {userService} from '../services';

export const userActions = {
    login,
    checkUser,
    logout
};


function login(username, password) {
    return dispatch => {
         userService.login(username, password)
             .then(
                data => {
                    console.log('user actions', data);
                    dispatch(success(data.token, data.username));
                },
                error => {
                    console.log('user error', error);
                    dispatch(failure(error));
                }
            );
    };

    function success(token, username) {
        console.log('success',token, username);
        return {type: userConstants.LOGIN_SUCCESS, accessToken : token, current_username: username}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}

function checkUser() {
    return dispatch => {
        userService.checkUser().then(
            username => {
                console.log('user check', username);
                dispatch(success(username));
            },
            error => {
                console.log('error check', error);
                dispatch(failure(error));
            }
        );
    };

    function success( username) {
        return {type: userConstants.LOGIN_SUCCESS, current_username: username}
    }

    function failure(error) {
        return {type: userConstants.LOGIN_FAILURE, error}
    }
}

function logout() {
    userService.logout();
    return {type: userConstants.LOGOUT};
}