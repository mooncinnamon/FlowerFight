import React, {Component} from 'react';

export class UserPanel extends Component {
    render() {
        const {
            username, money, gameResult, bettingSort
        } = this.props.userInfo;

        const {className} = this.props;

        return (
            <div className={className}>
                <img></img>
                <img></img>
                <img></img>
                <p>ID : {username}</p>
                <p>보유 머니 : {money}</p>
                <p>패 결과 표시 {gameResult}</p>
                <p>베팅 종류 {bettingSort}</p>
            </div>
        )
    }
}