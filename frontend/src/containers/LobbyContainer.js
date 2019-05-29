import React, {Component} from 'react';
import {connect} from "react-redux";
import {lobbyActions} from '../actions';
import {LobbyList} from '../components';

class LobbyContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lobbyList: []

        };

        console.log('session Check', localStorage.getItem("accessToken"));
        this.handleClick = this.handleClick.bind(this);
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

    render() {
        const {lobbyList} = this.props;
        console.log('LobbyContainer render', lobbyList);
        return (
            <div>
                <LobbyList lobbys={lobbyList}/>
                <button onClick={this.handleClick}>
                    방 만들기
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {

    return {
        lobbyList: state.lobby
    };
}

export default connect(mapStateToProps)(LobbyContainer);