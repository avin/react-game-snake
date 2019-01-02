import React from 'react';
import { Provider } from 'react-redux';
import Game from '../Game/Game';
import GitHubLink from '../GitHubLink/GitHubLink';

export default class Root extends React.Component {
    render() {
        const { store } = this.props;
        return (
            <Provider store={store}>
                <div className="filler">
                    <Game />
                </div>
                <GitHubLink />
            </Provider>
        );
    }
}
