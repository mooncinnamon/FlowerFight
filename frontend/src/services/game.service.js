import axios from "axios";
import {authHeader} from "../util";

export const gameService = {
    loadUserList,
    onStart,
    loadUserCards,
    betting,
    bettingCheck,
    startGame
};


/**
 * 여기서 부터는 Get
 */

//UserList 불러오기
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
            return response.data
        }).catch(res => {
            console.log('service', 'game', 'catch', res);
            return Promise.reject(res);
        });
}

// User가 가지고 있는 카드 불러오기
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

// 전 유저가 얼마를 베팅했는지 확인하기
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


function startGame(roomId, username) {
    const requestOptions = {
        headers: authHeader(),
        params: {
            id: roomId,
            username: username
        }
    };

    return axios.get('http://localhost:4000/v1/game/start/game', requestOptions)
        .then(response => {
            console.log('service', 'game', 'user', 'card', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'game', 'user', 'card', 'error', err);
            return err;
        })
}


/**
 * 여기서 부터는 Post
 */

// Game 시작
function onStart(id, username, userList) {
    const requestOptions = {
        headers: authHeader(),
    };

    const body = {
        "roomId": id,
        "username": username,
        "userList": userList
    };

    return axios.post('http://localhost:4000/v1/game/start', body, requestOptions)
        .then(response => {
            console.log('service', 'game', 'start', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'game', 'start', 'error', err);
            return err;
        })
}


// 베팅하기
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
