/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux';

import rootReducer from './reducer';
import App from './App';

// import * as serviceWorker from './serviceWorker';


function hydrate(cb) {
    if (process.env.NODE_ENV === "development")
        cb(createStore(rootReducer, applyMiddleware(thunkMiddleware)));
    else {
        chrome.storage.local.get('state', function (data) {
            console.log(data.state);
            cb(createStore(rootReducer, /* initialState */ data.state, applyMiddleware(thunkMiddleware)));
        });
    }
}

hydrate(function(store) {
    const rootElement = document.getElementById('root');
    ReactDOM.render(
        <Provider store={store}><App/></Provider>,
        rootElement
    );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
