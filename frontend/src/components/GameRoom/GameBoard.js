import React, {Component} from 'react';
import {UserPanel} from "./UserPanel";

export class GameBoard extends Component {

    render() {
        const {gameMember, handCards, bettingResult} = this.props;
        const css_dynamic = ['user1', 'user2', 'user3', 'user4', 'user5'];
        console.log('GameBoard', handCards, 'name', gameMember, 'bettingResult', bettingResult);
        const userList = gameMember.map(
            (user, index) => (
                <UserPanel
                    key={index}
                    user={user}
                    handCards={handCards[user.username]}
                    className={css_dynamic[index]}
                    bettingResult={bettingResult[user.username]}
                />)
        );

        return (
            <div>
                {userList}
            </div>
        )
    }
}