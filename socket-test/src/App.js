import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import sokcetio from 'socket.io-client';

const socket= sokcetio.connect('http://localhost:4000');

class App extends Component{
  constructor(props){
    super(props)
    socket.emit('join-room',{
      name: 'test'
    })
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
  }
}

export default App;
