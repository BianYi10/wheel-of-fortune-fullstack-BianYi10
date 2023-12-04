import logo from './wof.jpg';
import './App.css';
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import PopupWindow from './PopupWindow';
import PopupScoreWindow from './PopupScoreWindow';
import HistoryScoreWindow from './HistoryScoreWindow';
import axios from 'axios';

function App() {
  // Various state hooks for managing game and user data
  const phrase = "Have a great day";
  const [hiddenPhrase, setHiddenPhrase] = useState('');
  const [inputLetter, setInputLetter] = useState('');
  const [correctGuess, setCorrectGuess] = useState(false);
  const [chanceLeft, setChanceLeft] = useState(5);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [showGame, setShowGame] = useState(false);
  const [showUserName, setShowUserName] = useState(false);
  const [showChangeUserName, setShowChangeUserName] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [inputUserName, setInputUserName] = useState('');
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [first, setFirst] = useState(false);

  // Handles user login and sets the initial state
  function handleLogin(user){
      setUser(user);
      setFirst(true);
  }

  // Fetches user information by their Google ID
  function findUserInfoByGoogleId() {
    const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/findUserInfoByGoogleId?googleId=${user.uid}`;
    axios.get(url)
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        setShowUserName(true);
        setShowGame(false);
      });
  };

  // Handles submission of the user name
  function handleUserNameSubmit(event) {
    event.preventDefault();
    const postData = {
        googleId: user.uid,
        userName: inputUserName
    };
    try {
      const response = axios.post('https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/saveUserInfo', postData);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  // Handles changes to the letter input
  const handleInputChange = (event) => {
    setInputLetter(event.target.value);
  };

  // Returns the current formatted time
  const getCurrentFormattedTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  // Handles saving the game score
  function handleSaveStore(event) {
    event.preventDefault();
    const currentTime = getCurrentFormattedTime();
    const postData = {
        googleId: user.uid,
        date: currentTime,
        score
    };

    axios.post('https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/saveGameRecord', postData)
    .then(response => {
      if (response.data === 'success') {
        console.log("Success!");
      } else {
        console.log("Not success, the response is:", response.data);
      }
    })
    .catch(error => {
      console.error("Error:", error.message);
    });
    
    setScore(0);
    setShowScore(false);
  }

  // Handles canceling the score storing process
  function handleCancelStore(event) {
    event.preventDefault();
    setScore(0);
    setShowScore(false);
  }

  // Triggers the username change interface
  function handleChangeUserName(event) {
    event.preventDefault();
    setShowChangeUserName(true);
  }

  // Submits the new user name
  function handleChangeUserNameSubmit(event) {
    event.preventDefault();
    try {
      const url=`https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/updateUserName?googleId=${user.uid}&userName=${inputUserName}`
      const response = axios.post(url);
      setShowChangeUserName(false);
      setUserName(inputUserName);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }

  // Decrypts the given string based on the user's guess
  const decryptString = () => {
    const isCorrectGuess = phrase.toLowerCase().includes(inputLetter.toLowerCase());
    if (isCorrectGuess) {
      const updatedHiddenPhrase = Array.from(hiddenPhrase); // Update displayed phrase
      phrase.split('').forEach((char, index) => {
      if (char.toLowerCase() === inputLetter.toLowerCase()) {
          updatedHiddenPhrase[index] = char;
      }
      });

      setHiddenPhrase(updatedHiddenPhrase.join(''));

      if (!updatedHiddenPhrase.includes('*')) {
       setCorrectGuess(true);
      }
    }
    else{
    setChanceLeft(chanceLeft-1);
    }
  };

  // Handles the guess action and updates the game state accordingly
  const handleGuess = () => {
    if(chanceLeft<=0||correctGuess){
      const tmpPhrase = phrase.replace(/[a-zA-Z]/g, '*'); // Regular expression to hide letters
      setHiddenPhrase(tmpPhrase);
      setChanceLeft(5);
      setCorrectGuess(false);
    }
    else{
      decryptString();
    }
    setInputLetter('');
  };

  // Effect hook to initialize the hidden phrase when the component mounts
  useEffect(() => {
    const tmpPhrase = phrase.replace(/[a-zA-Z]/g, '*'); // Replaces all letters with asterisks
    setHiddenPhrase(tmpPhrase);
  }, []); // Empty dependency array ensures this effect runs only once on mount
  
  // Effect hook to fetch user information when the user state updates
  useEffect(() => {
    if (user) {
      findUserInfoByGoogleId();
    }
  }, [user]); // Dependency array includes user, so this effect runs whenever user changes
  
  // Effect hook to manage the score display based on the game state
  useEffect(() => {
    if (chanceLeft <= 0 || correctGuess) {
        setScore(chanceLeft);
        setShowScore(true);
    }
  }, [chanceLeft, correctGuess]); // Dependency array includes chanceLeft and correctGuess

  // Effect hook to show/hide the username input based on user info
  useEffect(() => {
    if(first){
      if (userInfo && Array.isArray(userInfo) && userInfo.length === 0) {
        setShowUserName(true);
        setShowGame(false);
      } else {
        setShowUserName(false);
        setShowGame(true);
        setUserName(userInfo.map(item => item.userName));
      }
    }
  }, [userInfo]); // Dependency array includes userInfo, so this effect runs whenever userInfo changes

  // State hook for managing the visibility of the history score window
  const [showHistoryScoreWindow, setShowHistoryScoreWindow] = useState(false);

  // Toggles the visibility of the history score window
  const handleShowHistoryScoreWindow = () => {
    setShowHistoryScoreWindow(!showHistoryScoreWindow);
  };

  // Main component return function with conditional rendering based on state
  return (
    <div className="App">
      <LoginForm LoginEvent={handleLogin}/>
      {showUserName ? (
        <PopupWindow
          labelName="input userName"
          onSubmit={handleUserNameSubmit}
          inputValue={inputUserName}
          onInputChange={e => setInputUserName(e.target.value)}
        />
      ):<></>
      }
      {showScore ? (
        <PopupScoreWindow
        score={score} 
        onSave={handleSaveStore} 
        onCancel={handleCancelStore} 
        />
      ):<></>
      }

      {showGame ? (
        <>
      <header className="App-header">
        <p>userName: {userName}</p>
        <button onClick={handleChangeUserName}>Change UserName</button>
        {showChangeUserName ? (
          <PopupWindow
            labelName="input userName"
            onSubmit={handleChangeUserNameSubmit}
            inputValue={inputUserName}
            onInputChange={e => setInputUserName(e.target.value)}
          />
        ):<></>
        }
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Wheel Of Fortune</h1>
        <p>Hidden Phrase: {hiddenPhrase}</p>
        <p>Chance Left: {chanceLeft}</p>

        <input
          type="text"
          placeholder="input a letter to guess"
          value={inputLetter} 
          onChange={handleInputChange} 
          maxLength={1}
        />
        {chanceLeft<=0&& <p>Sorry! You Lose!</p>}
        {correctGuess && <p>Congratulations! You Win!</p>}
        <button onClick={handleGuess}>Guess</button>
        <button onClick={handleShowHistoryScoreWindow}>
          {showHistoryScoreWindow ? 'Hide History Score Window' : 'Show History Score Window'}
          </button>
        {showHistoryScoreWindow && <HistoryScoreWindow googleId={user.uid}/>}
      </header>
      </>
        ):<></>
      }
    </div>
  );
}

export default App;
