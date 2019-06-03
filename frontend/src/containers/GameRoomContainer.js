import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import socketIo from "socket.io-client";
import {GameBoard} from "../components/GameRoom";
import {gameActions} from "../actions";
import {Button, ButtonGroup} from 'reactstrap';

let socket;

/**
 * Todo : 웹 소켓 처리하기
 * Todo : 게임 진행하기
 * Todo : GameMaster 바꾸기
 */

class GameRoomContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            response: false,
            endpoint: "ws://localhost:4000",
        };
        const {location} = this.props;
        const id = location.state.roomId;
        const master = location.state.roomMaster;
        socket = socketIo(this.state.endpoint, {transports: ['websocket']});
        this.props.onSetRoomId(id, master);

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handlerCallClick = this.handlerCallClick.bind(this);
        this.handleDieClick = this.handleDieClick.bind(this);
        this.handleHalfClick = this.handleHalfClick.bind(this);
        this.handleQuarterClick = this.handleQuarterClick.bind(this);
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    }

    componentDidMount() {
        const {username, location} = this.props;
        const roomId = location.state.roomId;

        socket = socketIo(this.state.endpoint, {transports: ['websocket']});
        this.props.onLoadUserList(roomId);
        if (typeof username !== 'undefined') {
            console.log('socket', 'io', 'emit', 'roomId', roomId, 'username', username);
            socket.emit('joinRoom', roomId, username);
        }

        socket.on('updateUser', (roomId, username) => {
            console.log('socket', 'io', 'updateUser', 'on', 'roomId', roomId, 'username', username);
            this.props.onLoadUserList(roomId);
        });

        socket.on('updateCards', (roomId, username) => {
            console.log('socket', 'io', 'updateCards', 'on', 'roomId', roomId, 'username', username, 'this', this.props.username);
            this.props.onLoadUserCards(roomId, this.props.username);
        });

        socket.on('betting', (boardMoney, bettingUser, bettingSort, nextUser) => {
            console.log('socket', 'io', 'betting', 'on', 'boardMoney', boardMoney, 'bettingUser', bettingUser, 'bettingSort', bettingSort, 'nextUser', nextUser);
            if (username === nextUser)
                this.props.onCheckBetting(roomId, username);
            this.props.setBoardMoney(boardMoney, bettingUser, bettingSort);
        });

        socket.on('finish', (cardSet, master) => {
            console.log('socket', 'io', 'finish', 'on', 'roomId', cardSet, 'master', master, 'this', this.props.username);
            this.props.handlerUpdateMaster(master);
            this.props.handleFinishBetting();
        });

    }

    componentWillUnmount() {
        socket.disconnect();
    }

    handleOnClick = (e) => {
        e.preventDefault();
        const {roomId, username, gameMember} = this.props;
        this.props.onGameStart(roomId, username, gameMember);
    };

    handleLeaveRoom = (e) => {
        e.preventDefault();
        const {roomId, username, history} = this.props;
        socket.emit('leaveRoom', roomId, username);
        history.replace('/lobby');
    };

    handlerCallClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onCallBetting(roomId, 'Call', username);
    };

    handleDieClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onDieBetting(roomId, 'Die', username);
    };

    handleHalfClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onHalfBetting(roomId, 'Half', username);
    };

    handleQuarterClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onQuaterBetting(roomId, 'Quarter', username);
    };


    render() {
        const {gameMember, username, roomMaster, buttonPanel, callMoney, start, cards, bettingResult} = this.props;
        console.log('type', typeof gameMember, 'data', gameMember, 'cards', cards);
        if (typeof username === 'undefined') {
            return (<h3>Please select any Error</h3>)
        } else {
            return (
                <div>
                    <Button
                        disabled={gameMember.length === 1 || username !== roomMaster || start}
                        onClick={this.handleOnClick}>
                        게임시작
                    </Button>
                    <div>판돈 : {bettingResult.boardMoney}</div>
                    <div>콜비용 : {callMoney}</div>
                    <GameBoard users={gameMember} handCards={cards} bettingResult={bettingResult}/>
                    <ButtonGroup>
                        <Button disabled={buttonPanel[0]} onClick={this.handlerCallClick}>콜</Button>
                        <Button disabled={buttonPanel[1]} onClick={this.handleDieClick}>다이</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button disabled={buttonPanel[2]} onClick={this.handleHalfClick}>하프</Button>
                        <Button disabled={buttonPanel[3]} onClick={this.handleQuarterClick}>쿼터</Button>
                    </ButtonGroup>
                    <Button onClick={this.handleLeaveRoom}>
                        방 나가기
                    </Button>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const {current_username} = state.authentication;
    const {roomId, roomMaster, userList} = state.gameInfomation;
    const {bettingState, start} = state.bettingState;
    const cards = state.cards;
    const bettingResult = state.bettingResult;
    return {
        roomId: roomId,
        roomMaster: roomMaster,
        username: current_username,
        gameMember: userList,
        buttonPanel: bettingState,
        start: start,
        cards: cards,
        bettingResult: bettingResult
    }
};

// 컨테이너 컴포넌트에서 프레젠테이션 컴포넌트로 액션을 보내는 함수
const mapDispatchToProps = (dispatch) => (
    {
        onLoadUserList: (id) => {
            dispatch(gameActions.loadUserList(id));
        },
        onSetRoomId: (id, master) => {
            dispatch(gameActions.setRoomId(id, master));
        },
        onGameStart: (id, username, userList) => {
            dispatch(gameActions.onStart(id, username, userList));
        },
        onLoadUserCards: (id, username) => {
            dispatch(gameActions.loadUserCards(id, username));
        },
        onCallBetting: (id, sort, username) => {
            dispatch(gameActions.bettingCall(id, sort, username));
        },
        onDieBetting: (id, sort, username) => {
            dispatch(gameActions.bettingDie(id, sort, username));
        },
        onHalfBetting: (id, sort, username) => {
            dispatch(gameActions.bettingHalf(id, sort, username));
        },
        onQuaterBetting: (id, sort, username) => {
            dispatch(gameActions.bettingQuater(id, sort, username));
        },
        setBoardMoney: (boardMoney, username, userBettingSort) => {
            dispatch(gameActions.setBettingResult(boardMoney, username, userBettingSort));
        },
        onCheckBetting: (id, username) => {
            dispatch(gameActions.onCheckBettiing(id, username));
        },
        handleFinishBetting: () => {
            dispatch(gameActions.onFinishBetting());
        },
        handlerUpdateMaster: (master) => {
            dispatch(gameActions.updateMaster(master));
        }
    }
);

GameRoomContainer.propType = {
    roomId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    gameMember: PropTypes.arrayOf(
        PropTypes.shape({
                name: PropTypes.string.isRequired,
                money: PropTypes.number.isRequired
            }
        )
    ).isRequired,
    buttonPanel: PropTypes.arrayOf(
        PropTypes.oneOf([0, 1])
    ).isRequired,
    onLoadUserList: PropTypes.func.isRequired,
    onSetRoomId: PropTypes.func.isRequired,
    boardMoney: PropTypes.number.isRequired,
    callMoney: PropTypes.number.isRequired,
    onGameStart: PropTypes.func.isRequired,
    onLoadUserCards: PropTypes.func.isRequired,
    cards: PropTypes.array.isRequired,
    onCallBetting: PropTypes.func.isRequired,
    onDieBetting: PropTypes.func.isRequired,
    onHalfBetting: PropTypes.func.isRequired,
    onQuaterBetting: PropTypes.func.isRequired,
    setBoardMoney: PropTypes.func.isRequired,
    onCheckBetting: PropTypes.func.isRequired,
    handleFinishBetting: PropTypes.func.isRequired,
    handlerUpdateMaster: PropTypes.func.isRequired
};

GameRoomContainer.defaultProps = {
    gameMember: [{name: '', money: 0}],
    boardMoney: 0,
    callMoney: 100
};
// 디스패치와 상태를 주입하려는 컴포넌트를 감싸줍니다.
export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);