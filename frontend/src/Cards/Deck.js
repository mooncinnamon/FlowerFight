import React, {Component} from "react";
import CardContainer from "./CardContainer";
import './Deck.css';

const stack = i => ({
    x: 0.1 * i,
    y: 0.1 * i,
    z: i
});

const suits = ["d", "c"];
const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"
];

const getInitialDeck = () =>
    ranks
        .map(r => suits.map(s => ({rank: r, suit: s})))
        .reduce((prev, curr) => prev.concat(curr));

function makeUserBoard(handDeck) {
    const array = [];
    handDeck.forEach(function (item) {
        array.push(item.cards[0], item.cards[1]);
    });
    return array;
}

class DeckContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {board: [], deck: []};
        console.log('deck', this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.handCard) {
            const board = makeUserBoard(nextProps.handCard);
            this.setState({board: board});
        }
    }


    render() {
        const {board} = this.state;
        const {size, boardYoffset, boardXoffset, handCard, userCardBoard} = this.props;
        const initDeck = getInitialDeck();
        console.log('Deck', 'initDeck', initDeck, 'handDeck', handCard, 'board', board);

        let faceDown = true;
        let rotate = 0;

        return (
            <div className={"Deck"}>
                {initDeck.map((card, i) => {
                    const cardPiece = card.rank + card.suit;
                    let bXo = boardXoffset;
                    let bYo = boardYoffset;
                    if (board.indexOf(cardPiece) !== -1) {
                        console.log(cardPiece, board.indexOf(cardPiece), Math.floor(board.indexOf(cardPiece) / 2));
                        const index = Math.floor(board.indexOf(cardPiece) / 2);
                        if (index === 1) {
                            bXo = -900;
                            bYo = -225;
                        } else if (index === 2) {
                            bXo = -1300;
                            bYo = 50;
                        } else if (index === 3) {
                            bXo = -900;
                            bYo = 50;
                        } else if (index === 4) {
                            bXo = -1300;
                            bYo = -225;
                        }

                    }
                    return (
                        <CardContainer
                            index={i}
                            key={cardPiece}
                            board={board}
                            userCardBoard={userCardBoard}
                            card={card}
                            faceDown={faceDown}
                            size={size}
                            boardXoffset={bXo} // board x offset relative to stack
                            boardYoffset={bYo} // board y offset relative to stack
                            mapXYZ={stack}
                            rotate={rotate}
                        />
                    );
                })}
            </div>
        );
    }
}

DeckContainer.defaultProps = {
    size: 100,
    boardXoffset: 475,
    boardYoffset: 500,
    rotate: 0
};

export default DeckContainer;
