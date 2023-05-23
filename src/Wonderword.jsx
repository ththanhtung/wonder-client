import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebsocket } from 'websocket';
import './App.css';
import { useSelector } from 'react-redux';

const client = new W3CWebsocket('ws://localhost:8080/start');

function Wonderword() {
  const [desc, setDesc] = useState('waiting game to start...');
  const [reveal, setReveal] = useState('');
  const [msgType, setMsgType] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [msgInput, setMsgInput] = useState('');
  const [username, setUsername] = useState('');
  const [userID, setUserID] = useState('');
  const [currentPlayerID, setCurrentPlayerID] = useState('none');
  const [currentPlayerName, setCurrentPlayerName] = useState('no one');
  const [score, setScore] = useState(0);
  const [countDown, setCountDown] = useState(10);
  const [messages, setMessages] = useState([]);
  const state = useSelector(state => state.user)

  // console.log("id",userID);
  // console.log("current user", currentPlayer);
  // console.log('msg:', messages);
  // console.log('state:', state);

  const guessHandler = () => {
    if (userID === currentPlayerID) {
      client.send(
        JSON.stringify({
          type: 'guess',
          payload: guessInput,
        })
      );
      client.send(
        JSON.stringify({
          type: 'guess',
          payload: guessInput,
          senderName: username,
          senderId: userID,
        })
      );
      setGuessInput('');
    }
  };

  const msgHandler = () => {
    if (userID !== '') {
      client.send(
        JSON.stringify({
          type: 'msg',
          payload: msgInput,
          senderName: username,
          senderId: userID,
        })
      );
      setMsgInput('');
      return;
    }
    alert('cannot send msg right now');
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setCountDown((prev) => {
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    client.onopen = () => {
      console.log('client connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      setMsgType(dataFromServer.type);
      if (dataFromServer.type === 'boardcast_game_state') {
        setDesc(dataFromServer.desc);
        setCurrentPlayerID(dataFromServer.userId);
        setCurrentPlayerName(dataFromServer.username);
        setCountDown(10);
        setReveal(dataFromServer.revealed);
      }
      if (dataFromServer.type === 'update_player_state') {
        setScore(dataFromServer.score);
        setUserID(dataFromServer.userId);
        setUsername(dataFromServer.username);
      }

      if (dataFromServer.type === 'win') {
        alert(`${dataFromServer.winner} has won the game`);
      }
      if (dataFromServer.type === 'boardcast_msg') {
        setMessages((prev) => [...prev, dataFromServer]);
      }
      console.log('got reply:', dataFromServer);
    };
  }, []);

  return (
    <div className="App">
      {/* chat app */}
      <div className="chat">
        <h2 className="title-chat mint">chat with your friends</h2>
        <div className="chat-box" >
          <ul>
            {messages.map((msg, index) => {
              return (
                <div key={index} className="msg-box">
                  <h6 className="title-sender">{msg.senderName.substring(0,17)}:</h6>
                  <p className="msg">{msg.payload}</p>
                </div>
              );
            })}
          </ul>
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <button type="submit" onClick={msgHandler}>
            send
          </button>
        </div>
      </div>

      {/* wonder word */}
      <div className="wonder-word">
        <h1 className="title-wonder mint">go wonder</h1>
        <p>
          {userID === currentPlayerID ? 'you' : currentPlayerName.substring(0,17)} have{' '}
          {countDown} second to guess
        </p>
        <p>score: {score}</p>
        <p>{desc}</p>
        <p>{reveal}</p>
        <input
          type="text"
          value={guessInput}
          placeholder="type a guess..."
          onChange={(e) => setGuessInput(e.target.value)}
          maxLength={1}
        />
        <button type="submit" onClick={guessHandler}>
          submit
        </button>
      </div>
    </div>
  );
}

export default Wonderword;
