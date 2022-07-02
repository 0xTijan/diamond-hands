import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MoralisProvider
      initializeOnMount={false}
      appId="83Reu8JlXgzEg9V1drN0OADuopa08eCSPLXz4czs"
      serverUrl="https://kivt14y98mje.usemoralis.com:2053/server"
    >
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
