import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {gameActions, lobbyActions} from '../actions';
import {LobbyList} from '../components';
import {ButtonGroup, Button, Container, Col, Row} from 'reactstrap';
import PropTypes from "prop-types";

/**
 * Todo : 전체적인 props, state 정리하기
 * Todo : 리듀서 정리하기
 */

class LobbyContainer extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleLobbyRefresh = this.handleLobbyRefresh.bind(this);
    }


    componentDidMount() {
        this.props.onListRoomList();
    }

    handleClick = (e) => {
        e.preventDefault();
        const {username, history} = this.props;

        const roomName = username + '의 방';
        const roomMaster = username;

        this.props.onMakeRoom(roomName, roomMaster, history);
    };

    handleLobbyClick = (key, e) => {
        e.preventDefault();
        const {username, history} = this.props;

        const roomId = key;
        const name = username;

        this.props.onInsertRoom(roomId, name, history);
    };

    handleLobbyRefresh = (e) => {
        e.preventDefault();
        this.props.onListRoomList();
    };

    /**
     * Todo: 들어가려는 방이 없으면 에러메세지 띄워주기
     */

    render() {
        const {lobbyList} = this.props;
        console.log('LobbyContainer render', lobbyList);
        return (
            <div>

                <button  onClick={this.handleLobbyRefresh}>새로고침</button>

                    <button onClick={this.handleClick}>방만들기</button>

                <div className="col-xs-12">
                    <div className="list-type3">
                        <LobbyList lobbyList={lobbyList} handleLobbyClick={this.handleLobbyClick}/>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {current_username} = state.authentication;
    const {lobby} = state.lobby;
    return {
        lobbyList: lobby,
        username: current_username
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        onListRoomList: () => {
            dispatch(lobbyActions.loadGameLobby());
        },
        onMakeRoom: (roomName, roomMaster, history) => {
            dispatch(lobbyActions.makeGame(roomName, roomMaster, history));
        },
        onInsertRoom: (roomId, name, history) => {
            dispatch(lobbyActions.insertGame(roomId, name, history));
        }
    }
);
export default connect(mapStateToProps, mapDispatchToProps)(LobbyContainer);