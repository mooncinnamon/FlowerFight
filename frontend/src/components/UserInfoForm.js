import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';
import {userActions} from "../actions";

export default class UserInfoForm extends Component {
    constructor(props) {
        super(props);
        console.log('userinfoform', props.current_username);
    }


    render() {
        const {current_username} = this.props;
        return (
            <Container>
                <h5>username : {current_username}</h5>
                <h5>판돈 : 100000</h5>
            </Container>
        )
    }
}