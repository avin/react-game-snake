import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './redux/store';
import Root from './components/Root/Root';
import './styles/index.scss';
import * as serviceWorker from './serviceWorker';

// Инициализирует redux-store
const store = configureStore();

// Монтируем React контейнер на страницу
const target = document.querySelector('#root');
ReactDOM.render(<Root store={store} />, target);

if (module.hot) {
    module.hot.accept('./components/Root/Root', () => {
        ReactDOM.render(<Root store={store} />, target);
    });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
