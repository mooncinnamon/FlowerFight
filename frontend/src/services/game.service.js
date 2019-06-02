import {gameConstants} from '../constants';
import axios from "axios";
import {authHeader} from "../util";

export const gameService = {
    loadUserList,
    onStart,
    loadUserCards,
    betting,
    bettingCheck
};


function loadUserList(roomId) {
    const requestOptions = {
        headers: authHeader(),
        params: {
            id: roomId
        }
    };


    return axios.get('http://localhost:4000/v1/game/user/list', requestOptions)
        .then(response => {
            console.log('service', 'game', response.data);
            const lobbyRoom = [];
            for (const key in response.data) {
                const data = JSON.parse(response.data[key]);
                lobbyRoom.push({
                    name: key,
                    money: data.money
                });
            }
            console.log('service', 'game', 'result', lobbyRoom);
            return {
                data: lobbyRoom
            }
        }).catch(res => {
            console.log('service', 'game', 'catch', res);
            return Promise.reject(res);
        });
}

function onStart(id, username, userList) {
    const requestOptions = {
        headers: authHeader(),
    };

    const body = {
        "roomId": id,
        "username": username,
        "userList": userList
    };

    console.log('service', 'game', 'start', 'body', body);

    return axios.post('http://localhost:4000/v1/game/start', body, requestOptions)
        .then(response => {
            console.log('service', 'game', 'start', response);
            return response;
        }).catch(err => {
            console.log('service', 'game', 'start', 'error', err);
            return err;
        })
}

function loadUserCards(roomId, username) {
    const requestOptions = {
        headers: authHeader(),
        params: {
            id: roomId,
            username: username
        }
    };
    console.log('service', 'game', 'user', requestOptions);
    return axios.get('http://localhost:4000/v1/game/user/card', requestOptions)
        .then(response => {
            console.log('service', 'game', 'user', 'card', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'game', 'user', 'card', 'error', err);
            return err;
        })
}

function betting(id, sort, username) {
    const requestOptions = {
        headers: authHeader(),
    };

    const body = {
        "roomId": id,
        "sort": sort,
        "username": username
    };

    return axios.post('http://localhost:4000/v1/game/betting', body, requestOptions)
        .then(res => {
            console.log('service', 'beeting', res.data);
            return res.data
        }).catch(err => {
            return err
        })
}

function bettingCheck(roomId, username) {
    const requestOptions = {
        headers: authHeader(),
        params: {
            id: roomId,
            username: username
        }
    };

    return axios.get('http://localhost:4000/v1/game/betting/check', requestOptions)
        .then(response => {
            console.log('service', 'game', 'user', 'card', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'game', 'user', 'card', 'error', err);
            return err;
        })
}