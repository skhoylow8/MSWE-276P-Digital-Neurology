import React, { useState } from 'react';
import './App.css';
import background from './background.jpg';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';

function App() {
  const [currentForm, setCurrentFrom] = useState('login')

  const myStyle={
    backgroundImage: "url(" + background + ")", // <a href="https://www.freepik.com/free-vector/ai-technology-brain-background-vector-digital-transformation-concept_16268324.htm#query=digital%20brain&position=33&from_view=search&track=ais">Image by rawpixel.com</a> on Freepik
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    margin: 0,
  };

  const toggleForm = (formName) =>{
    setCurrentFrom(formName);
  }

  return (
    <div className="App" style = {myStyle} >
      {
        currentForm == 'login' ? <Login onFormSwitch={toggleForm} /> : currentForm == 'register' ? <Register onFormSwitch={toggleForm} /> : <ForgotPassword onFormSwitch={toggleForm} />
      } 
    </div>
  );
}

export default App;
