import React, {Component} from 'react';
import {connect} from "react-redux";
import {lobbyActions} from '../actions';
import {LobbyList} from '../components';
import {ButtonGroup, Button, Container, Col, Row} from 'reactstrap';


class LobbyContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyList: []

        };

        console.log('session Check', localStorage.getItem("accessToken"));
        this.handleClick = this.handleClick.bind(this);
        this.lobbyClick = this.lobbyClick.bind(this);
    }


    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(lobbyActions.getGameLobby());
    }

    handleClick(e) {
        e.preventDefault();
        const {dispatch, history} = this.props;
        const users = {
            roomId: '3',
            roomName: 'hell',
            roomMaster: 'mooncinnamon'
        };
        console.log('make room button Click');
        dispatch(lobbyActions.makeGame(users, history));
    }

    lobbyClick(e) {
        e.preventDefault();
        const {distpach, history} = this.props;
        const users = {
            roomMaster: 'testuser'
        };
        console.log('room list click');
        distpach(lobbyActions.insertGame(users, history));
    }

    render() {
        const {lobbyList} = this.props;
        console.log('LobbyContainer render', lobbyList);
        return (
            <Container>
                <Row>
                    <Col xs={10}>
                        <LobbyList lobbys={lobbyList}/>
                    </Col>
                    <Col xs={2}>
                        <ButtonGroup vertical={true}>
                            <Button onClick={this.handleClick}>
                                방 만들기
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

function mapStateToProps(state) {

    return {
        lobbyList: state.lobby
    };
}

export default connect(mapStateToProps)(LobbyContainer);