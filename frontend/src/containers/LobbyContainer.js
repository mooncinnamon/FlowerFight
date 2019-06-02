import React, {Component} from 'react';
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
        const users = {
            roomName: username + '의 방',
            roomMaster: username
        };
        this.props.onMakeRoom(users, history);
    }

    handleLobbyClick = (key, e) => {
        e.preventDefault();
        const {username, history} = this.props;
        const users = {
            roomId: key,
            name: username
        };
        this.props.onInsertRoom(users, history);
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
            <Container>
                <Row>
                    <Col xs={10}>
                        <LobbyList lobbyList={lobbyList} handleLobbyClick={this.handleLobbyClick}/>
                    </Col>
                    <Col xs={2}>
                        <ButtonGroup vertical={true}>
                            <Button onClick={this.handleClick}>
                                방 만들기
                            </Button>
                            <Button onClick={this.handleLobbyRefresh}>
                                새로고침
                            </Button>
                            <Button>
                                종료
                            </Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Container>
        )
    }
}

LobbyContainer.propTypes = {
    onListRoomList: PropTypes.func.isRequired,
    onMakeRoom: PropTypes.func.isRequired,
    onInsertRoom: PropTypes.func.isRequired
};


const mapStateToProps = (state) => {
    const {current_username} = state.authentication;
    return {
        lobbyList: state.lobby,
        username: current_username
    };
};

const mapDispatchToProps = (dispatch) => (
    {
        onListRoomList: () => {
            dispatch(lobbyActions.loadGameLobby());
        },
        onMakeRoom: (users, history) => {
            dispatch(lobbyActions.makeGame(users, history));
        },
        onInsertRoom: (users, history) => {
            dispatch(lobbyActions.insertGame(users, history));
        }
    }
);
export default connect(mapStateToProps, mapDispatchToProps)(LobbyContainer);