import React, {Component} from 'react';
import FilterLink from '../containers/FilterLink'
import PropTypes from 'prop-types';

Object.size = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

export default class ButtonPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const memberSize = Object.size(this.props.memberList);
        return (
            <div>
                <FilterLink
                    filter={"game"}
                    disabled={(memberSize !== 5)}
                    onClick={(e) => this.handleStartClick(e)}
                >
                    Start
                </FilterLink>

                <button onClick={(e) => this.handleCancleClick(e)}>
                    Cancel
                </button>
            </div>
        );
    }

    handleStartClick(e) {
        const member = this.props.memberList;
        this.props.onStartClick(member);
    }

    handleCancleClick(e) {
        const member = null;
        this.props.onCancleClick(member);
    }
}

ButtonPanel.propTypes = {
    memberList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        userMoney: PropTypes.number.isRequired
    }).isRequired).isRequired,
    onStartClick: PropTypes.func.isRequired,
    onCancleClick: PropTypes.func.isRequired
};