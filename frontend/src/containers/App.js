import React, {Component, Fragment} from 'react';
import {userActions} from '../actions';
import {connect} from 'react-redux';
import {Jumbotron, Container, Row, Col} from 'reactstrap';
import {GamePanel, LoginForm, UserInfoForm, Menu} from '../components';

import './css/App.css';


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

    componentDidMount() {
        const {dispatch} = this.props;
        if (localStorage.getItem("accessToken")) {
            console.log('user check component');
            dispatch(userActions.checkUser());
        }
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
            console.log('handle', 'submit');
            dispatch(userActions.login(username, password));
        }

    }

    render() {
        const {loggedIn, current_username} = this.props;
        const {username, password} = this.state;
        return (
            <Fragment>
                <Menu/>
                <secction className="seMain">
                    <Container fluid={true}>
                        <div className="seMain set-bg"
                             style={{backgroundImage: `url('images/slider-1.jpg')`}}>
                        </div>

                        <Row>
                            <Col xs="6">
                                <GamePanel loggedIn={loggedIn}/>
                            </Col>
                            <Col xs="6">
                                {loggedIn || localStorage.getItem('accessToken') ?
                                    <UserInfoForm current_username = {current_username}/> :
                                    <LoginForm
                                        username={username}
                                        password={password}
                                        handleSubmit={this.handleSubmit}
                                        handleChange={this.handleChange}
                                    />
                                }

                            </Col>
                        </Row>
                    </Container>
                </secction>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    const {loggedIn, current_username} = state.authentication;
    return {
        loggedIn,
        current_username
    };
}

export default connect(mapStateToProps)(App);
