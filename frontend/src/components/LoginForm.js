import React, {Component} from "react";

class LoginForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form className="form-horizontal templatemo-container templatemo-login-form-1 margin-bottom-30" role="form"
                  action="#" method="post" onSubmit={this.props.handleSubmit}>
                <div className="form-group">
                    <div className="col-xs-11">
                        <div className="control-wrapper">
                            <label htmlFor="username" className="control-label fa-label"><i
                                className="fa fa-user fa-medium"/></label>
                            <input type="text" className="form-control" id="username" placeholder="Username"
                                   name="username" value={this.props.username} onChange={this.props.handleChange}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-11">
                        <div className="control-wrapper">
                            <label htmlFor="password" className="control-label fa-label"><i
                                className="fa fa-lock fa-medium"/></label>
                            <input type="password" className="form-control" id="password" placeholder="Password"
                                   name="password" value={this.props.password} onChange={this.props.handleChange}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12">
                        <div className="control-wrapper">
                            <button className="btn btn-danger btn-xs">로 그 인</button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default LoginForm;