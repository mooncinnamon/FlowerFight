import React from 'react'
import PropTypes from 'prop-types'

const Lobby = ({ name }) => (
    <li>
        <a href={'/game'}>
        {name}
        </a>
    </li>
)


export default Lobby