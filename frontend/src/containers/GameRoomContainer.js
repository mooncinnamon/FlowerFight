import React, {Component} from "react";
import Deck from "../Cards/Deck";
import {connect} from "react-redux";

import axios from 'axios';

let socket;

const query = queryString.parse(location.search);

class Lobby extends Component {

    constructor(props) {
        super(props);
        this.state = {
            response: false,
            endpoint: "http://localhost:3001"
        };
        axios.get('http://localhost:3001/v1/user/list')
            .then(response => {
                    console.log('axios', response.data);
                    response.data.forEach((user) => {
                        this.props.handleAddMember(user)
                    })
                }
            );
    }

    componentDidMount() {
        const username = query.username;
        socket = socketIo(this.state.endpoint);
        if (typeof username !== 'undefined') {
            socket.emit('send-username', username);
            socket.on('recv-username', (res) => {
                this.props.handleAddMember(res);
            });
            socket.on('chatting-room', (res) => {
                this.props.handleRecvMessage(res)
            });
        }
    }

    componentWillUnmount() {
        socket.disconnect();
    }


    render() {
        const {dispatch, lobbyMember, chattingRoom} = this.props;
        const username = query.username;
        if (typeof username === 'undefined') {
            return (<h3>Please select any Error</h3>)
        }
        else {
            return (<div>
                    <MemberList
                        memberList={lobbyMember}
                    />

                    <ChattingBox
                        onSendMessage={this.props.handleSendMessage}
                        username={query.username}
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


Lobby.propTypes = {
    lobbyMember: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        userMoney: PropTypes.number.isRequired
    })),
    chattingRoom: PropTypes.string.isRequired
};

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
            socket.emit('send-message', query.username ,data);
        },
        handleRecvMessage: (data) => {
            console.log('recv data', data);
            dispatch(recvMessage(data))
        }
    }
};


// 디스패치와 상태를 주입하려는 컴포넌트를 감싸줍니다.
export default connect(memberStateToProps, memberDispatchToProps)(Lobby);