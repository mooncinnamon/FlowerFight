import React, {Component} from "react";
import {cancleGame, startGame, addMember, deleteMember, addMemberSocket, recvMessage} from "../actions/game.actions";
import Deck from "../Cards/Deck";
import queryString from "query-string"
import {connect} from "react-redux";
import {MemberList, ButtonPanel, ChattingBox} from "../components";
import socketIo from "socket.io-client";

import axios from 'axios';

let socket;

class Lobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            response: false,
            endpoint: "http://localhost:4000"
        };
        /*axios.get('http://localhost:4000/v1/user/list')
            .then(response => {
                    console.log('axios', response.data);
                    response.data.forEach((user) => {
                        this.props.handleAddMember(user)
                    })
                }
            );*/
    }

    componentDidMount() {
        const username = 'master';
        socket = socketIo(this.state.endpoint);
        if (typeof username !== 'undefined') {
            socket.emit('joinRoom', username);
        }
    }

    componentWillUnmount() {
        socket.disconnect();
    }


    render() {
        const {dispatch, lobbyMember, chattingRoom} = this.props;
        // const username = query.username;
        const username = 'mooncinnamon';
        if (typeof username === 'undefined') {
            return (<h3>Please select any Error</h3>)
        }
        else {
            return (<div>
                    <MemberList
                        memberList={['moonciannmon']}
                    />

                    <ChattingBox
                        onSendMessage={this.props.handleSendMessage}
                        username={username}
                        chatting={chattingRoom.chatting}
                    />

                    <ButtonPanel
                        memberList={lobbyMember}
                        onStartClick={(lobbyMember) =>
                            dispatch(startGame(lobbyMember))
                        }
                        onCancleClick={(lobbyMember) =>
                            dispatch(cancleGame(lobbyMember))
                        }
                    />
                </div>
            )
        }
    }
}

const memberStateToProps = (state) => {
    return {
        lobbyMember: state.members,
        chattingRoom : state.chattingRoom
    }
};

// 컨테이너 컴포넌트에서 프레젠테이션 컴포넌트로 액션을 보내는 함수
const memberDispatchToProps = (dispatch) => {
    return {
        handleAddMember: (data) => {
            dispatch(addMember(data)) // 액션 메서드
        },
        handleSendMessage: (data) => {
            socket.emit('joinRoom', 'mooncinnamon' );
        },
        handleRecvMessage: (data) => {
            console.log('recv data', data);
            dispatch(recvMessage(data))
        }
    }
};


// 디스패치와 상태를 주입하려는 컴포넌트를 감싸줍니다.
export default connect(memberStateToProps, memberDispatchToProps)(Lobby);