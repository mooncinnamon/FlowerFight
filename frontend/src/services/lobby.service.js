
import axios from 'axios';
import {authHeader} from '../util';
import {lobbyConstants} from "../constants";

export const lobbyService = {
    getlobby,
    makeGame
};

function getlobby() {
    const requestOptions = {
        headers: authHeader(),
    };

    console.log('lobbyService','getlobby', requestOptions);
    return axios.get(`http://localhost:4000/v1/room/list`, requestOptions)
        .then(response => {
            console.log('getlobby get',response.data);
            return response.data;
        })
        .catch(response => {
            console.log(response);
        });
}

function makeGame(user){
    const requestOptions = {
        headers: authHeader(),
        roomId:user.roomId,
        roomName:user.roomName,
        roomMaster: user.roomMaster
    };
    console.log('lobbyService','makeGame');
    return axios.post(`http://localhost:4000/v1/room/make`, requestOptions)
        .then(response =>{
            console.log('makeGame','post', response.data)
        }).catch(err =>{
            console.log('makeGame','post','err',err);
        })
}