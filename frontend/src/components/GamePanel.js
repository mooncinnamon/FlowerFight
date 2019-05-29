import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NewWindow from 'react-new-window'

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
            <div>
                <button onClick={() => this.toggleOpened()}>
                    GameStart
                </button>
                {clicked && this.props.loggedIn &&
                <NewWindow
                    url={url}
                    onUnload={() => this.newWindowUnloaded()}
                    features={features}
                />
                }
            </div>
        );
    }

    toggleOpened() {
        if(this.props.loggedIn) {
            this.setState((prevState) => ({
                clicked: !prevState.clicked
            }))
        }else {
            console.log("please login");
        }
    }

    newWindowUnloaded() {
        this.setState({clicked: false})
    }
}

const features = {
    width: 1280,
    height: 1280,
    left: 0,
    top: 0,
};


export default GamePanel;