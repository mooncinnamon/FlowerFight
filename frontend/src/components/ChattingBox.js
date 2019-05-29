import React, {findDOMNode, Component} from 'react';
import PropTypes from 'prop-types';

export default class ChattingBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
        this.chattingBox = React.createRef();
        this.handleTextChange = this.handleTextChange.bind(this);
    }
    componentDidUpdate() {
        this.chattingBox.current.scrollTop = this.chattingBox.current.scrollHeight;
    }


    render() {
        return (
            <div>
                <div>
                    <textarea id="chatLog" className="chat_log" ref={this.chattingBox} value={this.props.chatting} readOnly/>
                </div>
                <section>
                    <input id="name" className="name" type="text" value={this.props.username} readOnly/>
                    <input id="message"
                           className="message"
                           type="text"
                           value={this.state.text}
                           onChange={this.handleTextChange}
                    />
                    <button onClick={(e) => this.handleAddMessage(e)}>
                        Send
                    </button>
                </section>
            </div>
        )
    }

    handleTextChange(e) {
        this.setState({
            text: e.target.value
        })
    };

    handleAddMessage(e) {
        console.log('sendMessage' , this.state.text);
        this.props.onSendMessage(this.state.text);
        this.setState({
            text: ''
        })
    }

}