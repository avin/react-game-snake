import React from 'react';
import { Provider } from 'react-redux';
import Game from '../Game/Game';

export default class Root extends React.Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <Game />
            </Provider>
        );
    }
}
