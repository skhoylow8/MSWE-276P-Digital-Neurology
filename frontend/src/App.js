import React, { useState } from 'react';
import './App.css';
import background from './background.jpg';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';

function App() {
  const [currentForm, setCurrentFrom] = useState('login')

  const myStyle={
    backgroundImage: "url(" + background + ")",
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
