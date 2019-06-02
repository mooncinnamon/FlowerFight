import React, {Component, Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import NewWindow from 'react-new-window'
import {Button, Col} from 'reactstrap';

class GamePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
            url: '/lobby',
            token: ''
        };
    }

    render() {
        const {clicked, url} = this.state;
        return (
            <Fragment>
                <section className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 col-md-offset-3">
                                <div className="primary-button">
                                    <a href="#" class="scroll-link" data-id="book-table"
                                       onClick={() => this.toggleOpened()}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {clicked && this.props.loggedIn &&
                <NewWindow
                    url={url}
                    onUnload={() => this.newWindowUnloaded()}
                    features={features}
                />
                }
            </Fragment>
        );
    }

    toggleOpened() {
        if (this.props.loggedIn) {
            this.setState((prevState) => ({
                clicked: !prevState.clicked
            }))
        } else {
            console.log("please login");
        }
    }

    newWindowUnloaded() {
        this.setState({clicked: false})
    }
}

const features = {
    width: 1920,
    height: 1280,
    left: 0,
    top: 0,
};


export default GamePanel;