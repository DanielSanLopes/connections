import React from 'react';
// import logo from './logo.svg'
import './App.css';
import  AuthProvider  from './contexts/AuthContext';
import Switcher from './Switcher';
import ConnectionsScreen from './screens/ConnectionsScreen';
import ChatScreen from './screens/ChatScreen';

function App() {

  return (
    <div className="App" style={{height:"100%"}}>
      <AuthProvider>
        {/* <ChatScreen/> */}
        {/* <ConnectionsScreen/> */}
        <Switcher/>
      </AuthProvider>
      
    
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

    </div>
  );
}

export default App;
