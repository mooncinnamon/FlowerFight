import React, {Component} from 'react'
import {ListGroup, ListGroupItem} from 'reactstrap';

class LobbyList extends Component {
    render() {
        const {lobbyList, handleLobbyClick} = this.props;
        return (
            <ListGroup>
                {
                    lobbyList.map(lobby => (
                        <ListGroupItem key={lobby.roomId} name={lobby.roomName}
                                       onClick={handleLobbyClick.bind(this,lobby.roomId)}>
                            {lobby.roomName}
                        </ListGroupItem>
                    ))
                }
            </ListGroup>
        )
    }
}

export default LobbyList;