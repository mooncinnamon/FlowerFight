/*
 * action types
 */

export const START_GAME = 'START_GAME';
export const START_CANCLE = 'CANCLE';
export const ADD_MEMBER = 'ADD_MEMBER';
export const DELETE_MEMBER = 'DELETE_MEMBER';
export const RECV_MESSAGE = 'RECV_MESSAGE';

/*
 * action creators
 */

export function recvMessage(text) {
    return {type: RECV_MESSAGE, data: text}
}

export function startGame(members) {
    return {type: START_GAME, members};
}

export function cancleGame() {
    return {type: START_CANCLE};
}

export function addMember(data) {
    return {
        type: ADD_MEMBER,
        id: data.id,
        userName: data.userName,
        userMoney: data.userMoney,
        roomMaster: data.roomMaster
    }
}

export function deleteMember(member) {
    return {type: DELETE_MEMBER, member};
}

export const addMemberSocket = (socket, id, item) => {
    return (dispatch) => {
        const postData = {
            id: id + 1,
            item: item,
            completed: false
        };
        socket.emit('addMember', postData)
    }
}