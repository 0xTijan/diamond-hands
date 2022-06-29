import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Lock from './components/lock/Lock';
import Unlock from './components/unlock/Unlock';

function App() {
  return (
    <div className='bg'>
      <Header />
      <Lock />
      <Unlock />
    </div>
  );
}

export default App;
