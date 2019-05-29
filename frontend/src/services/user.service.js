
import axios from 'axios';
import {authHeader} from '../util';
import {userConstants} from "../constants";

export const userService = {
    login,
    logout,
};

function login(username, password) {
    const requestOptions = {
        headers: {'Content-Type': 'application/json'},
        "usernameOrEmail": username,
        "password": password
    };

    return axios.post(`http://localhost:8080/api/auth/signin`, requestOptions)
        .then(response => {
            if (response.status === 200) {
                console.log('user service', response);
                localStorage.setItem('accessToken', JSON.stringify(response.data));
                return response.data;
            }
        })
        .catch(response => {
            console.log('post error', response);
            logout();
            return Promise.reject(response);
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('accessToken');
}