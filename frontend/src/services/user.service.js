import axios from 'axios';
import {authHeader} from '../util';

export const userService = {
    login,
    logout,
    checkUser
};

// Session Stroage
function login(username, password) {
    const requestOptions = {
        headers: {'Content-Type': 'application/json'},
        "usernameOrEmail": username,
        "password": password
    };

    return axios.post(`http://localhost:8080/api/auth/signin`, requestOptions)
        .then(response => {
            console.log('login', response);
            if (response.status === 200) {
                console.log('user service', response);
                sessionStorage.setItem('accessToken', JSON.stringify(response.data));
                return {
                    token: response.data.token,
                    username: response.data.username
                };
            }
        }).catch(response => {
            console.log('post error', response);
            logout();
            return Promise.reject(response);
        });
}

function checkUser() {
    const requestOptions = {
        headers: authHeader(),
    };
    return axios.get(`http://localhost:8080/api/user/me`, requestOptions)
        .then(res => {
            return res.data.username;
        })
        .catch(response => {
            console.log('error', response);
            logout();
            return Promise.reject(response);
        });
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('accessToken');
}