import React from 'react';
import StatusBar from './StatusBar/StatusBar';
import styles from './styles.module.scss';
import Board from './Board/Board';

export default class Game extends React.Component {
    render() {
        return (
            <div className={styles.game}>
                <StatusBar />
                <Board />
            </div>
        );
    }
}
