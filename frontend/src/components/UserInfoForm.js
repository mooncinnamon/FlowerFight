import React, {Component} from 'react';

export default class UserInfoForm extends Component {
    constructor(props) {
        super(props);
        console.log('userinfoform', props.current_username);
    }


    render() {
        const {current_username} = this.props;
        return (
            <div className={"templatemo-container margin-bottom-30"} >
                <h5>username : {current_username}</h5>
            </div>
        )
    }
}