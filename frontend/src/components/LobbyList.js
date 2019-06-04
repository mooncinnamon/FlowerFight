import React, {Component} from 'react'
import {ListGroup, ListGroupItem} from 'reactstrap';

class LobbyList extends Component {
    render() {
        const {lobbyList, handleLobbyClick} = this.props;
        console.log('lobbyList', lobbyList);
        return (
            <ul>
                {
                    lobbyList.map(lobby => (
                        <li key={lobby.roomId}
                            onClick={handleLobbyClick.bind(this, lobby.roomId)}>
                            <a href={'#'}>
                                {lobby.roomName}
                            </a>
                        </li>
                    ))
                }
            </ul>
        )
    }
}

export default LobbyList;