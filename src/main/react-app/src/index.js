import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './components/App.jsx';
import Navigation from './components/Navigation.jsx';
import reportWebVitals from './reportWebVitals';

const content = ReactDOM.createRoot(document.getElementById('react-content'));
content.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();