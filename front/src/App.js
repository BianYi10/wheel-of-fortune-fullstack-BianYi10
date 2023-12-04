import logo from './wof.jpg';
import './App.css';
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import PopupWindow from './PopupWindow';
import PopupScoreWindow from './PopupScoreWindow';
import HistoryScoreWindow from './HistoryScoreWindow';
import axios from 'axios';

function App() {
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

  function handleLogin(user){
      setUser(user);
  }

  function findUserInfoByGoogleId() {
    const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/findUserInfoByGoogleId?googleId=${user.uid}`;
    console.log(url);
    axios.get(url)
      .then(response => {
        console.log("response.data=",response.data);
        setUserInfo(response.data);
      })
      .catch(error => {
        console.log("error.message= ",error.message);
        setShowUserName(true);
        setShowGame(false);
        console.log("error");
      });
  };

  function handleUserNameSubmit(event) {
    event.preventDefault();
    console.log("user.uid is ",user.uid);
    console.log("inputUserName is ",inputUserName);
    const postData = {
        googleId:user.uid,
        userName:inputUserName
    };
    try {
      const response = axios.post('https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/saveUserInfo', postData);
      console.log('Response:', response.data);
      setShowUserName(false);
      setShowGame(true);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputLetter(event.target.value);
  };

  const getCurrentFormattedTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  function handleSaveStore(event) {
    event.preventDefault();
    const currentTime = getCurrentFormattedTime();
    console.log("user.uid is ",user.uid);
    console.log("date is",currentTime);
    console.log("score is ",score);
    const postData = {
        googleId:user.uid,
        date:currentTime,
        score
    };

    axios.post('https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/saveGameRecord', postData)
    .then(response => {
      console.log("response.data=",response.data);
      if (response.data === 'success') {
        console.log("Success!");
      } else {
        console.log("Not success, the response is:", response.data);
      }
    })
    .catch(error => {
      console.log("error.message= ",error.message);
    });
    
    setScore(0);
    setShowScore(false);
  }

  function handleCancelStore(event) {
    event.preventDefault();
    setScore(0);
    setShowScore(false);
  }
  function handleChangeUserName(event) {
    event.preventDefault();
    setShowChangeUserName(true);
  }

  function handleChangeUserNameSubmit(event) {
    event.preventDefault();
    console.log("user.uid is ",user.uid);
    console.log("inputUserName is ",inputUserName);
    try {
      const url=`https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/updateUserName?googleId=${user.uid}&userName=${inputUserName}`
      const response = axios.post(url);
      console.log('Response:', response.data);
      setShowChangeUserName(false);
      setUserName(inputUserName);
    } catch (error) {
      console.error('Error posting data:', error);
    }
  }


  const decryptString = () => {
    const isCorrectGuess = phrase.toLowerCase().includes(inputLetter.toLowerCase());
    if (isCorrectGuess) {
      const updatedHiddenPhrase = Array.from(hiddenPhrase); // Update displayed phrase
      phrase.split('').forEach((char, index) => {
        if (char.toLowerCase() === inputLetter.toLowerCase()) { // ==(ignore the type)  ===(compare the type)
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


  const handleGuess = () => {
    if(chanceLeft<=0||correctGuess){
      const tmpPhrase= phrase.replace(/[a-zA-Z]/g, '*');// regular expression
      setHiddenPhrase(tmpPhrase);
      setChanceLeft(5);
      setCorrectGuess(false);
    }
    else{
      console.log(hiddenPhrase);
      console.log(phrase);
      console.log(inputLetter);
      decryptString();
      console.log(hiddenPhrase);
    }
    setInputLetter('');
  };

  useEffect(() => {
    // 在组件挂载时将 phrase 变为 hiddenPhrase
    const tmpPhrase= phrase.replace(/[a-zA-Z]/g, '*');
    setHiddenPhrase(tmpPhrase);
  }, []); // 空数组表示只在组件挂载时执行一次
  useEffect(() => {
    if (user) {
      console.log("查询是否有userName");
      findUserInfoByGoogleId();
    }
  }, [user]); // 依赖列表中包含 user，表示 user 更新时执行
  useEffect(() => {
    if (chanceLeft <= 0 || correctGuess) {
      setScore(chanceLeft);
      setShowScore(true);
      console.log("setScore");
    }
  }, [chanceLeft, correctGuess]);
  useEffect(() => {
    console.log("userInfo"); // 当 userInfo 更新后，这里会被执行
    if (userInfo && Array.isArray(userInfo) && userInfo.length === 0) {
      setShowUserName(true);
      setShowGame(false);
    } else {
      setShowUserName(false);
      setShowGame(true);
      setUserName(userInfo.map(item => item.userName));
      console.log("userInfo.map(item => item.userName)= ",userInfo.map(item => item.userName));
    }
  }, [userInfo]);

  const [showHistoryScoreWindow, setShowHistoryScoreWindow] = useState(false);

  const handleShowHistoryScoreWindow = () => {
    setShowHistoryScoreWindow(!showHistoryScoreWindow);
  };
  
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
