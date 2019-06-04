import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import socketIo from "socket.io-client";
import {gameActions, gameFinishResult} from "../actions";


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

        //MasterUpdate
        socket.on('roomMasterUpdate', (NewMaster) => {
            console.log('newMaster', NewMaster);
            this.props.updateMaster(NewMaster);
        });

        // 종료
        socket.on('finish', (winUser, handCardJson, winMoney) => {
            console.log('socket', 'io', 'finish', 'on', 'winUser', winUser, 'cardSet', handCardJson, 'winMoney',winMoney);
            this.props.handleGameFinish(winUser, handCardJson,winMoney);
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
        const {gameMember, roomMaster, start, windUser, windMoney} = this.props;
        const {buttonPanel} = this.props;
        const {handCards} = this.props;
        const {boardMoney, callMoney, userBetting, userMoney} = this.props;
        console.log('type', typeof gameMember, 'data', gameMember, 'cards', handCards);
        if (typeof username === 'undefined') {
            return (<h3>Please select any Error</h3>)
        } else {
            return (
                <Fragment>
                    <link rel="stylesheet" href="css/bootstrap2.min.css"/>
                    <link rel="stylesheet" href="css/font-awesome.min.css"/>
                    <link rel="stylesheet" href="css/animate.min.css"/>
                    <link rel="stylesheet" href="css/templatemo-style2.css"/>
                    <link
                        href="https://fonts.googleapis.com/css?family=Do+Hyeon|Gaegu|Nanum+Pen+Script|Noto+Serif+KR&display=swap"
                        rel="stylesheet"/>
                    <section id="bgbg">
                        <div className="conainter">
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="box">
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <div className="box2x">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            {(gameMember[2] === undefined) ?
                                                                <div className="charbox"/> :
                                                                <div className="charbox1">
                                                                </div>}
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(gameMember[2] === undefined) ? "대기중..." : gameMember[2]}</p>
                                                            </div>
                                                            <div className="col-xs-12">
                                                                <div className="boxname">
                                                                    <p>{(userMoney[gameMember[2]] === undefined) ? "" : userMoney[gameMember[2]]}</p>
                                                                </div>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box3">
                                                    <img
                                                        src={(handCards[gameMember[2]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[2]][0] + ".png"}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box4">
                                                    <img
                                                        src={(handCards[gameMember[2]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[2]][1] + ".png"}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-2">
                                    <div className="result1">
                                        <div className="row">
                                            <p>{(userBetting[gameMember[2]] === undefined) ? "" : userBetting[gameMember[2]]}</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="col-xs-3">
                                    <div className="result3">
                                        <div className="row">
                                            <p>{(userBetting[gameMember[3]] === undefined) ? "" : userBetting[gameMember[3]]}</p>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-xs-3 ">
                                    <div className="boxp5">
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <div className="box2x">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            {(gameMember[3] === undefined) ?
                                                                <div className="charbox"/> :
                                                                <div className="charbox5">
                                                                </div>}
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(gameMember[3] === undefined) ? "대기중..." : gameMember[3]}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(userMoney[gameMember[3]] === undefined) ? "" : userMoney[gameMember[3]]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-xs-4">
                                                <div className="box3">
                                                    <img
                                                        src={(handCards[gameMember[3]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[3]][0] + ".png"}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box4">
                                                    <img
                                                        src={(handCards[gameMember[3]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[3]][1] + ".png"}/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="box">
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <div className="box2x">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            {(gameMember[1] === undefined) ?
                                                                <div className="charbox"/> :
                                                                <div className="charbox2">
                                                                </div>}
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(gameMember[1] === undefined) ? "대기중..." : gameMember[1]}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(userMoney[gameMember[1]] === undefined) ? "" : userMoney[gameMember[1]]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box3">
                                                    <img
                                                        src={(handCards[gameMember[1]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[1]][0] + ".png"}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box4">
                                                    <img
                                                        src={(handCards[gameMember[1]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[1]][1] + ".png"}/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-5">
                                    <div className="row">
                                        <div className="col-xs-1">
                                            <div className="result1p2">
                                                <div className="row">
                                                    <p>{(userBetting[gameMember[1]] === undefined) ? "" : userBetting[gameMember[1]]}</p>
                                                </div>
                                            </div>


                                        </div>

                                        <div className="col-xs-10">
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <div className="mbox">
                                                        <h3>{boardMoney}</h3>
                                                    </div>
                                                </div>
                                                <div className="col-xs-12">
                                                    <div className="callbox">
                                                        <h3>{callMoney}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-xs-1">
                                            <div className="result5">
                                                <div className="row">
                                                    <p>{(userBetting[gameMember[4]] === undefined) ? "" : userBetting[gameMember[4]]}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className="boxp4">
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <div className="box2x">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            {(gameMember[4] === undefined) ?
                                                                <div className="charbox"/> :
                                                                <div className="charbox4">
                                                                </div>}
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(gameMember[4] === undefined) ? "대기중..." : gameMember[4]}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(userMoney[gameMember[4]] === undefined) ? "" : userMoney[gameMember[4]]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box3">
                                                    <img
                                                        src={(handCards[gameMember[4]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[4]][0] + ".png"}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box4">
                                                    <img
                                                        src={(handCards[gameMember[4]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[4]][0] + ".png"}/>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-4">
                                    <div className="resultbox">
                                        <div className="col-xs-12"><p>"{windUser}"</p></div>
                                        <div className="col-xs-12"><p>{windMoney}</p></div>
                                        {(gameMember.length > 2 && username === roomMaster && !start) ?
                                            <div className="col-xs-12">
                                                <button onClick={this.handleOnClick} className="startbox"/>
                                            </div> :
                                            <div></div>
                                        }
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <div className="boxp3">
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <div className="box2x">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            {(gameMember[0] === undefined) ?
                                                                <div className="charbox"/> :
                                                                <div className="charbox3">
                                                                </div>}
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(gameMember[0] === undefined) ? "대기중..." : gameMember[0]}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div className="boxname">
                                                                <p>{(userMoney[gameMember[0]] === undefined) ? "" : userMoney[gameMember[0]]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box3">
                                                    <img
                                                        src={(handCards[gameMember[0]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[0]][0] + ".png"}/>
                                                </div>
                                            </div>
                                            <div className="col-xs-4">
                                                <div className="box4">
                                                    <img
                                                        src={(handCards[gameMember[0]] === undefined) ? "images/sp/0.png" : "images/sp/" + handCards[gameMember[0]][1] + ".png"}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xs-2">
                                    <div className="result1p3">
                                        <div className="row">
                                            <p>{(userBetting[gameMember[0]] === undefined) ? "" : userBetting[gameMember[0]]}</p>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-xs-2">
                                    <div className="buttonbox">
                                        <div className="row">
                                            <div className="col-xs-6">
                                                <button disabled={buttonPanel[0]} className="callbutton"
                                                        onClick={this.handlerCallClick}/>
                                            </div>
                                            <div className="col-xs-6">
                                                <button disabled={buttonPanel[1]} onClick={this.handleDieClick}
                                                        className="diebutton"/>
                                            </div>
                                            <div className="col-xs-6">
                                                <button disabled={buttonPanel[3]} onClick={this.handleQuarterClick}
                                                        className="qtbutton"/>
                                            </div>
                                            <div className="col-xs-6">
                                                <button disabled={buttonPanel[2]} onClick={this.handleHalfClick}
                                                        className="hfbutton"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Fragment>
            )
        }
    }
}

const mapStateToProps = (state) => {
    const {current_username} = state.authentication;
    const {roomId, roomMaster, windUser,windMoney, userList} = state.gameStore;
    const {start, bettingState} = state.bettingState;
    const handCards = state.cardStore;
    const {boardMoney, callMoney, userBetting, userMoney} = state.bettingStore;
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
        userBetting: userBetting,
        userMoney: userMoney,
        windMoney: windMoney
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
        handleGameFinish: (winUser, handCardJson, winMoney) => {
            dispatch(gameActions.gameFinishResult(winUser, handCardJson, winMoney));
        },
        updateMaster: (newMaster) => {
            dispatch(gameActions.updateMaster(newMaster));
        }
    }
);

GameRoomContainer.defaultProps = {
    gameMember: [],
    userBetting: {}
};


// 디스패치와 상태를 주입하려는 컴포넌트를 감싸줍니다.
export default connect(mapStateToProps, mapDispatchToProps)(GameRoomContainer);