import React, {Component, Fragment} from 'react';
import {userActions} from '../actions';
import {connect} from 'react-redux';
import {GamePanel, LoginForm, UserInfoForm} from '../components';


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

    // Session
    componentDidMount() {
        const {dispatch} = this.props;
        if (sessionStorage.getItem("accessToken")) {
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
                <link rel="stylesheet" href="css/bootstrap.min.css"/>
                <link rel="stylesheet" href="css/bootstrap-theme.min.css"/>
                <link rel="stylesheet" href="css/fontAwesome.css"/>
                <link rel="stylesheet" href="css/hero-slider.css"/>
                <link rel="stylesheet" href="css/owl-carousel.css"/>
                <link rel="stylesheet" href="css/templatemo-style.css"/>

                <GamePanel loggedIn={loggedIn}/>
                <section className="sign-up">
                    <div className="container">
                        <div className="col-md-12">
                            {loggedIn || sessionStorage.getItem('accessToken') ?
                                <UserInfoForm current_username={current_username}/> :
                                <LoginForm
                                    username={username}
                                    password={password}
                                    handleSubmit={this.handleSubmit}
                                    handleChange={this.handleChange}
                                />
                            }
                        </div>
                    </div>
                </section>
                <section className="services">
                    <div className="container-fluid">
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="service-item">
                                <a href="menu.html">

                                </a>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="service-item">
                                <a href="howtoplay.html">
                                    <img src="images/main/how2.png"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <div className="service-item">
                                <a href="create-account.html">
                                    <img src="images/main/create.png"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <p></p>
                            </div>

                            <div className="col-md-4">
                                <p>Copyright all rights reserved </p>
                            </div>
                        </div>
                    </div>
                </footer>
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
