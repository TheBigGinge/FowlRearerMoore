import React from 'react';
import { render } from 'react-dom';
import { Provider, Store } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, Middleware } from 'redux';
import thunk from 'redux-thunk';

import App from 'components/App';
import './main.scss';

let store: Store<{}>;

// Creates our redux store + middleware
const createReduxStore = (): void => {
    const middlewareList: Middleware[] = [thunk];
    const middleware = applyMiddleware(...middlewareList);

    store = createStore(
        middleware
    );
};

// Helper which contains all app-specific initialization
const initApp = (): void => {
    createReduxStore();

    // Attach app to DOM
    const appRoot = document.getElementById('appRoot');
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        appRoot
    );
};

const bootstrap = async () => {
    initApp();
};

bootstrap();
