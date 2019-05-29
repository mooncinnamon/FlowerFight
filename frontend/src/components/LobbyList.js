import React from 'react'
import PropTypes from 'prop-types'
import Lobby from './Lobby'

const LobbyList = ({ lobbys }) => (
    <ul>
        {lobbys.map(lobby => (
            <Lobby key={lobby.roomMaster} name={lobby.roomName} />
        ))}
    </ul>
)
export default LobbyList;