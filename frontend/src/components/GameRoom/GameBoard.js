import React, {Component} from 'react';
import {UserPanel} from "./UserPanel";

export class GameBoard extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        const {data} = this.props;
        const css_dynamic = ['user1','user2','user3','user4','user5'];

        const userList = data.map(
            info => (<UserPanel key={info.id} userInfo={info} className={css_dynamic[info.id]}/>)
        );

        return (
            <div>
                {userList}
            </div>
        )
    }
}