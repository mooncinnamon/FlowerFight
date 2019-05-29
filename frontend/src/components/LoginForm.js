import React, {Component} from "react";

class LoginForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <form name="form" onSubmit={this.props.handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" name="username" value={this.props.username}
                           onChange={this.props.handleChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" name="password" value={this.props.password}
                           onChange={this.props.handleChange}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Login</button>
                </div>
            </form>
        )
    }
}

export default LoginForm;