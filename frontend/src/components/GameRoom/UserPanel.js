import React, {Component} from 'react';

/**
 * Todo 사람마다 cards 다르게 보이기
 */
export class UserPanel extends Component {
    render() {
        const {
            name, money, bettingSort
        } = this.props.userInfo;

        const {className} = this.props;
        const {handCards} = this.props;
        const {bettingResult} = this.props;
        console.log('up', handCards, 'name', name, 'bettingResult', bettingResult);
        return (
            <div className={className}>
                <img></img>
                <img></img>
                <img></img>
                <p>ID : {name}</p>
                <p>보유 머니 : {money}</p>
                <p>패 결과 표시 {
                    (handCards === undefined) ? ['0a', '0b'] : handCards.cards
                }:</p>
                <p>베팅 종류
                    {
                        (bettingResult === undefined) ?
                            'None' :
                            (bettingResult[name] === -1) ?
                                'None' :
                                bettingResult[name]
                    }
                </p>
            </div>
        )
    }
}