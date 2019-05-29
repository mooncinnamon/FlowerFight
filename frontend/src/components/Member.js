import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Member extends Component {
    constructor(props) {
        super(props);
        const data = this.props.userName;
        console.log('member props', data);
    }

    render() {
        return (
            <li>
                {this.props.userName}
            </li>
        );
    }
}

Member.propTypes = {
    userName: PropTypes.string.isRequired
};