import React, { useEffect, useState, useRef } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { setUser } from './userSlice';

function Login() {
  const [input, setInput] = useState('');
  const [start, setStart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const submit = useRef();
  const nav = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const element = submit.current;
    element.addEventListener('mousedown', (e) => {
      e.preventDefault();
      setStart(!start);
    });
    return () => {
      element.removeEventListener('mousedown', (e) => {
        e.preventDefault();
        setStart('done');
      });
    };
  });

  const startHandler = () => {
    if (isLoading) {
      return;
    }

    const action = setUser(input)
    dispatch(action)

    
    // Start loading
    setIsLoading(true);


    // Simulate request delay
    setTimeout(() => {
      // Perform your request here
      nav('play');

      // Reset loading state after 1 second
      setIsLoading(false);
    }, 1000);
  };

  let done = start ? 'done' : ' ';

  return (
    <div className="container">
      <h1 className="title-login mint">go wonder</h1>
      <div className="content">
        <form className={'subscription ' + done}>
          <input
            className="add-email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="type your username here"
          />
          <button
            ref={submit}
            className="submit-email"
            type="button"
            onClick={startHandler}
          >
            <span className="before-submit">start</span>
            <span className="after-submit">enjoy the game!</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
