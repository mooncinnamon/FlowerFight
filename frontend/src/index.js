import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Provider} from "react-redux";

import App from "./containers/App";
import Lobby from "./containers/LobbyContainer";
import Game from "./containers/GameRoomContainer";

import {store} from './util';

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>

            <Route exact path={"/"} component={App}/>
            <Route path={"/lobby"} component={Lobby}/>

            <Route path={"/game"} component={Game}/>

        </BrowserRouter>
    </Provider>,
    rootElement
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about services workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
