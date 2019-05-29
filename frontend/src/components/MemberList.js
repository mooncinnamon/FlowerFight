import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Member from './Member';

export default class MemberList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                {this.props.memberList.map((member, index) =>
                    <Member {...member}
                            key={index}
                    />
                )}
            </ul>
        );
    }
}

MemberList.propTypes = {
    memberList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        userMoney: PropTypes.number.isRequired
    }).isRequired).isRequired,
};