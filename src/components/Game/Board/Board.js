import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import LabelScreen from './LabelScreen/LabelScreen';
import { Field } from './Field/Field';
import { CELL_MARGIN_PX, CELL_SIZE_PX, DIRECTION, FIELD_SIZE } from '../../../constants/game';
import { gameTick, pauseGame, restartGame, setDirection } from '../../../redux/modules/game/actions';
import WaitCircle from './WaitCircle/WaitCircle';

const { key } = window;

export class Board extends React.Component {
    gameTickTimeoutId = null;

    state = {
        showWaitCircle: false,
    };

    doGameTick = ({ skipTick = false, startReadiness = false } = {}) => {
        if (startReadiness) {
            this.setState({
                showWaitCircle: true,
            });
        } else if (this.state.showWaitCircle) {
            this.setState({
                showWaitCircle: false,
            });
        }

        if (this.gameTickTimeoutId) {
            clearTimeout(this.gameTickTimeoutId);
        }

        const { level } = this.props;

        let tickTimeout = 120 - level * (5 - level / 10);

        // Если нужно время на подготовку
        if (startReadiness) {
            tickTimeout = 1000;
        }

        this.gameTickTimeoutId = setTimeout(this.doGameTick, tickTimeout);

        if (skipTick || startReadiness) {
            return;
        }

        const { gameTick } = this.props;
        gameTick();
    };

    stopGame = () => {
        if (this.gameTickTimeoutId) {
            clearTimeout(this.gameTickTimeoutId);
        }
        if (this.state.showWaitCircle) {
            this.setState({
                showWaitCircle: false,
            });
        }
    };

    resumeGame = () => {
        this.doGameTick({ skipTick: true });
    };

    setDirection = direction => {
        const { level, pause, setDirection } = this.props;
        if (level !== null && !pause) {
            setDirection(direction);
        }
    };

    bindKeys = () => {
        key('up', () => {
            this.setDirection(DIRECTION.TOP);
        });

        key('right', () => {
            this.setDirection(DIRECTION.RIGHT);
        });

        key('down', () => {
            this.setDirection(DIRECTION.BOTTOM);
        });

        key('left', () => {
            this.setDirection(DIRECTION.LEFT);
        });

        key('space', () => {
            const { level, restartGame, pauseGame, pause, gameOver } = this.props;
            if (level === null || gameOver) {
                restartGame();
            } else {
                pauseGame(!pause);
            }
        });
    };

    unBindKeys = () => {
        key.unbind('top');
        key.unbind('right');
        key.unbind('bottom');
        key.unbind('left');
        key.unbind('space');
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            // Если началась игра
            (!prevProps.level && this.props.level) ||
            // Или рестарт после гамовера
            (prevProps.gameOver && !this.props.gameOver)
        ) {
            this.doGameTick({ startReadiness: true });
        }

        if (this.props.lives < prevProps.lives && !this.props.gameOver) {
            this.doGameTick({ startReadiness: true });
        }

        if (!prevProps.gameOver && this.props.gameOver) {
            this.stopGame();
        }

        if (!prevProps.pause && this.props.pause) {
            this.stopGame();
        }

        if (prevProps.pause && !this.props.pause) {
            this.resumeGame();
        }
    }

    componentDidMount() {
        this.bindKeys();
    }

    componentWillUnmount() {
        this.stopGame();
        this.unBindKeys();
    }

    render() {
        const { pause, gameOver, level } = this.props;
        const { showWaitCircle } = this.state;

        const sizePx = (CELL_SIZE_PX + CELL_MARGIN_PX) * FIELD_SIZE + CELL_MARGIN_PX;
        return (
            <div
                className={styles.board}
                style={{
                    width: sizePx,
                    height: sizePx,
                }}
            >
                {level !== null && <Field />}
                <LabelScreen
                    active={level === null}
                    label={
                        <div>
                            Press
                            <br />
                            &lt; SPACE &gt;
                            <br />
                            to start
                        </div>
                    }
                />
                <LabelScreen active={pause} label="Pause" blink />
                <LabelScreen active={gameOver} label="Game Over" />

                {showWaitCircle && <WaitCircle radius={20} />}
                {/* <WaitCircle radius={20}/>*/}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        pause: state.game.get('pause'),
        level: state.game.get('level'),
        lives: state.game.get('lives'),
        startReadiness: state.game.get('startReadiness'),
        gameOver: state.game.get('gameOver'),
    };
}

export default connect(
    mapStateToProps,
    {
        gameTick,
        setDirection,
        restartGame,
        pauseGame,
    },
)(Board);
