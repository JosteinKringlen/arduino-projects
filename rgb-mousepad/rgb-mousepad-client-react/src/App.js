import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {

    onTurnOff = id => {
        axios({
            method: 'post',
            url: `http://localhost:8080/${id}`,
        }).then(res => console.log(res))
            .catch(err => console.error(err));
    };

    onQuit = () => {
        /* axios({
            method: 'post',
            url: `http://localhost:8080/quit`,
        }).then(res => console.log(res))
            .catch(err => console.error(err));*/
    };

  render() {
    return (
      <div className="App">
          <div style={{display: 'flex', flexDirection: 'column'}}>
          <button onClick={() => this.onTurnOff(0)}>Turn off</button>
          <button onClick={() => this.onTurnOff(1)}>Rainbow</button>
          <button onClick={() => this.onTurnOff(2)}>Static</button>
          <button onClick={() => this.onTurnOff(3)}>Reverse Rainbow</button>
          <button onClick={() => this.onTurnOff(4)} className="hideButtons">Pulse</button>
          <button onClick={() => this.onTurnOff('y')} className="hideButtons">Pulse FU</button>
          <button onClick={() => this.onTurnOff('z')}>Epileptic Glory</button>
          <button onClick={() => this.onQuit()}>Quit</button>
          </div>
      </div>
    );
  }
}

export default App;
