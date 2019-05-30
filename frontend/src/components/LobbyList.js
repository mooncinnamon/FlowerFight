import React from 'react'
import PropTypes from 'prop-types'
import Lobby from './Lobby'
import { ListGroup } from 'reactstrap';

const LobbyList = ({lobbys}) => (
    <ListGroup>
        {lobbys.map(lobby => (
            <Lobby key={lobby.roomMaster} name={lobby.roomName}/>
        ))}
    </ListGroup>
)
export default LobbyList;