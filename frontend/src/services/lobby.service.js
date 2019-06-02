import axios from 'axios';
import {authHeader} from '../util';
import {lobbyConstants} from "../constants";

export const lobbyService = {
    loadLobby,
    makeGame,
    insertGame,
};

const requestOptions = {
    headers: authHeader(),
};

function loadLobby() {
    return axios.get(`http://localhost:4000/v1/room/list`, requestOptions)
        .then(response => {
            console.log('services', 'lobby', 'success', 'loadLobby', response.data);
            return response.data;
        })
        .catch(err => {
            console.log('services', 'lobby', 'error', 'loadLobby', err);
            return err;
        });
}

/**
 * @param user
 * @returns {Promise<AxiosResponse<any> | never>}
 *
 * "roomId": "841ef590-8412-11e9-9c34-45ad6e6255cd",
 * "roomName": "TestUser의 방",
 * "roomMaster": "testuserTemp1",
 * "roomCreatAt": "2019-06-01T02:11:07.240Z"
 */
function makeGame(user) {
    const body = {
        "roomName": user.roomName,
        "roomMaster": user.roomMaster
    };
    return axios.post(`http://localhost:4000/v1/room/make`, body, requestOptions)
        .then(response => {
            console.log('makeGame', 'post', response.data);
            return response.data;
        }).catch(err => {
            console.log('makeGame', 'post', 'err', err);
            return err;
        })
}

function insertGame(user) {
    const body = {
        'roomId': user.roomId,
        'userName': user.name
    };
    return axios.post(`http://localhost:4000/v1/room/input`, body, requestOptions)
        .then(response => {
            console.log('inputGame', 'post', response.data);
            return response.data;
        }).catch(err => {
            console.log('inputGame', 'post', 'err', err);
            return err;
        })
}