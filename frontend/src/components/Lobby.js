import React from 'react'
import PropTypes from 'prop-types'
import {ListGroupItem} from 'reactstrap';

const Lobby = ({ name }) => (
    <ListGroupItem>
        <a href={'/game'}>
        {name}
        </a>
    </ListGroupItem>
)


export default Lobby