import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import { restartGame, pauseGame } from '../../../redux/modules/game/actions';

export class ControlBar extends React.Component {
    handleRestartGame = () => {
        const { restartGame } = this.props;
        restartGame();
    };

    handlePauseGame = () => {
        const { pauseGame, pause } = this.props;
        pauseGame(!pause);
    };

    render() {
        const { level, pause } = this.props;

        return (
            <div className={styles.bar}>
                <div className={styles.section}>
                    <button onClick={this.handlePauseGame} disabled={level === null}>
                        {pause ? 'Resume' : 'Pause'}
                    </button>
                </div>
                <div className={styles.section}>
                    <button onClick={this.handleRestartGame}>{level === null ? 'Start' : 'Restart'} game</button>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        level: state.game.get('level'),
        pause: state.game.get('pause'),
    };
}

export default connect(
    mapStateToProps,
    {
        restartGame,
        pauseGame,
    },
)(ControlBar);
