import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import "./nullstyle.css";
import "animate.css/animate.min.css";
import store from './redux/store';
import { Provider } from "react-redux";
import App from './components/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
         <App />
    </Provider>
);