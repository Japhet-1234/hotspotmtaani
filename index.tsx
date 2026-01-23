import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Target the correct 'root' element defined in index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure your index.html has a <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);