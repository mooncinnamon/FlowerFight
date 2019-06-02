import React, {Component} from 'react';
import {UserPanel} from "./UserPanel";

export class GameBoard extends Component {

    render() {
        const {users, handCards, bettingResult} = this.props;
        const css_dynamic = ['user1', 'user2', 'user3', 'user4', 'user5'];

        const userList = users.map(
            (user, index) => (
                <UserPanel
                    key={index}
                    userInfo={user}
                    handCards={handCards[index]}
                    className={css_dynamic[index]}
                    bettingResult={bettingResult[index]}
                />
                )
        );

        return (
            <div>
                {userList}
            </div>
        )
    }
}