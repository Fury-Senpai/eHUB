// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      Imports
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Our global styles with Tailwind
import { store } from './redux/store.js'; // Import our Redux store
import { Provider } from 'react-redux'; // Import the Provider component

// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
//      App Rendering
// ~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      The <Provider> component makes the Redux store available to any
      nested components that need to access the Redux state.
      We wrap our entire <App /> with it.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
