import React, {Component} from 'react';
import {userActions} from '../actions';
import {connect} from 'react-redux';
import { GamePanel, LoginForm, UserInfoForm} from '../components';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const {username, password} = this.state;
        const {dispatch} = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }
    render() {
        const {loggedIn} = this.props;
        const {username, password} = this.state;
        return (
            <div>
                { loggedIn ||localStorage.getItem('accessToken') ?
                    <UserInfoForm/>:
                    <LoginForm
                        username={username}
                        password={password}
                        handleSubmit={this.handleSubmit}
                        handleChange={this.handleChange}
                    />
                }
                <GamePanel loggedIn={loggedIn}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {loggedIn} = state.authentication;
    return {
        loggedIn
    };
}

export default connect(mapStateToProps)(App);
