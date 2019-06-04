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

/**
 * 여기는 Get이다.
 * @returns {Promise<AxiosResponse<any> | never>}
 */
function loadLobby() {
    return axios.get(`http://localhost:4000/v1/room/list`, requestOptions)
        .then(response => {
            console.log('services', 'lobby', 'loadLobby', response.data);
            return response.data;
        })
        .catch(err => {
            console.log('services', 'lobby', 'loadLobby', 'error', err);
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
function makeGame(roomname, username) {
    const body = {
        "roomName": roomname,
        "roomMaster": username
    };

    return axios.post(`http://localhost:4000/v1/room/make`, body, requestOptions)
        .then(response => {
            console.log('service', 'lobby', 'makeGame', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'lobby', 'makeGame', 'error', err);
            return err;
        })
}

function insertGame(id, username) {

    const body = {
        'roomId': id,
        'userName': username
    };

    return axios.post(`http://localhost:4000/v1/room/input`, body, requestOptions)
        .then(response => {
            console.log('service', 'lobby', 'inputGame', response.data);
            return response.data;
        }).catch(err => {
            console.log('service', 'lobby', 'inputGame', 'error', err);
            return err;
        })
}