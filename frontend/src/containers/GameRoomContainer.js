import React, {Component} from "react";
import {connect} from "react-redux";
import socketIo from "socket.io-client";
import {GameBoard} from "../components/GameRoom";
import {gameActions, gameFinishResult} from "../actions";
import {Button, ButtonGroup} from 'reactstrap';


/**
 * Todo : 웹 소켓 처리하기
 * Todo : 게임 진행하기
 * Todo : GameMaster 바꾸기
 */
let socket;

class GameRoomContainer extends Component {


    constructor(props) {
        super(props);
        this.state = {
            response: false,
            endpoint: "ws://localhost:4000",
        };


        this.handleOnClick = this.handleOnClick.bind(this);
        this.handlerCallClick = this.handlerCallClick.bind(this);
        this.handleDieClick = this.handleDieClick.bind(this);
        this.handleHalfClick = this.handleHalfClick.bind(this);
        this.handleQuarterClick = this.handleQuarterClick.bind(this);
        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
    }

    componentDidMount() {
        const {username, roomId, handCards, location} = this.props;
        socket = socketIo(this.state.endpoint, {transports: ['websocket']});
        /**
         *  Socket Event:
         *  joinRoom : 방에 들어옴
         *  startGame: 게임이 시작 됨
         *  updateUser: 유저 정보가 갱신됨
         *  updateCard: 카드 정보가 갱신됨
         *  updateBetting: 베팅 정보가 갱신됨
         *  finish : 게임이 끝남
         */
        // 유저가 방에 들어온 경우
        if (typeof username !== 'undefined') {
            console.log('socket', 'io', 'emit', 'roomId', location.state.roomId);
            socket.emit('joinRoom', location.state.roomId, username);
        }
        //gameStart
        socket.on('startGame', (roomId) => {
            console.log('socket', 'io', 'startGame', 'on', 'roomId', roomId);
            this.props.onStart(roomId, username);
        });
        // user목록 업데이트
        socket.on('updateUser', (roomId) => {
            console.log('socket', 'io', 'updateUser', 'on', 'roomId', roomId);
            this.props.onLoadUserList(roomId);
        });

        // 카드 업데이트
        socket.on('updateCard', (roomId) => {
            console.log('socket', 'io', 'updateCard', 'on', 'roomId', roomId);
            this.props.onLoadUserCards(roomId, username);
        });

        // 베팅 업데이트
        socket.on('updateBetting', (boardMoney, callMoney, bettingUser, bettingSort, nextUser) => {
            console.log('socket', 'io', 'betting', 'on',
                '\nboardMoney', boardMoney,
                '\nbettingUser', bettingUser,
                '\ncallMoney', callMoney,
                '\nbettingSort', bettingSort,
                '\nnextUser', nextUser);
            // 내가 다음 유저면
            if (username === nextUser)
                this.props.onCheckBettingState(roomId, username);
            this.props.setBoardMoney(boardMoney, callMoney, bettingUser, bettingSort);
        });

        // 종료
        socket.on('finish', (winUser) => {
            console.log('socket', 'io', 'finish', 'on', 'winUser', winUser);
            this.props.handleGameFinish(winUser);
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
        this.props.onCallBetting(roomId, username);
    };

    handleDieClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onDieBetting(roomId, username);
    };

    handleHalfClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onHalfBetting(roomId, username);
    };

    handleQuarterClick = (e) => {
        e.preventDefault();
        const {roomId, username} = this.props;
        this.props.onQuaterBetting(roomId, username);
    };


    render() {
        const {username} = this.props;
        const {gameMember, roomMaster, start} = this.props;
        const {buttonPanel} = this.props;
        const {handCards} = this.props;
        const {boardMoney, callMoney, userBetting} = this.props;
        console.log('type', typeof gameMember, 'data', gameMember, 'cards', handCards);
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
                    <div>판돈 : {boardMoney}</div>
                    <div>콜비용 : {callMoney}</div>
                    <GameBoard gameMember={gameMember} handCards={handCards} bettingResult={userBetting}/>
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
    const {roomId, roomMaster, windUser, userList} = state.gameStore;
    const {start, bettingState} = state.bettingState;
    const handCards = state.cardStore;
    const {boardMoney, callMoney, userBetting} = state.bettingStore;
    return {
        roomId: roomId,
        roomMaster: roomMaster,
        windUser: windUser,
        username: current_username,
        gameMember: userList,
        buttonPanel: bettingState,
        start: start,
        handCards: handCards,
        boardMoney: boardMoney,
        callMoney: callMoney,
        userBetting: userBetting
    }
};

// 컨테이너 컴포넌트에서 프레젠테이션 컴포넌트로 액션을 보내는 함수
const mapDispatchToProps = (dispatch) => (
    {
        // Socket -> |
        onLoadUserList: (id) => {
            dispatch(gameActions.loadUserList(id));
        },
        onGameStart: (id, username, userList) => {
            dispatch(gameActions.onStart(id, username, userList));
        },
        // Socket -> |
        onStart: (id, username) => {
            dispatch(gameActions.startGame(id, username));
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
        setBoardMoney: (boardMoney, callMoney, username, userBettingSort) => {
            dispatch(gameActions.updateBettingResult(boardMoney, callMoney, username, userBettingSort));
        },
        // Socket -> |
        onCheckBettingState: (id, username) => {
            dispatch(gameActions.updateBettingState(id, username));
        },
        handleGameFinish: (winUser) => {
            dispatch(gameActions.gameFinishResult(winUser));
        }
    }
);

GameRoomContainer.defaultProps = {
    gameMember: [],
    userBetting: {}
};


// 디스패치와 상태를 주입하려는 컴포넌트를 감싸줍니다.
export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);