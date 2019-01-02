import React from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import LabelScreen from './LabelScreen/LabelScreen';
import { Field } from './Field/Field';
import { CELL_MARGIN_PX, CELL_SIZE_PX, DIRECTION, FIELD_SIZE } from '../../../constants/game';
import { gameTick, setDirection } from '../../../redux/modules/game/actions';

const { key } = window;

export class Board extends React.Component {
    gameTickTimeoutId = null;

    doGameTick = ({ skipTick = false } = {}) => {
        if (this.gameTickTimeoutId) {
            clearTimeout(this.gameTickTimeoutId);
        }

        this.gameTickTimeoutId = setTimeout(this.doGameTick, 100);

        if (skipTick) {
            return;
        }

        const { gameTick } = this.props;
        gameTick();
    };

    pauseGame = () => {
        if (this.gameTickTimeoutId) {
            clearTimeout(this.gameTickTimeoutId);
        }
    };

    unPauseGame = () => {
        this.doGameTick({ skipTick: true });
    };

    bindKeys = () => {
        const { setDirection } = this.props;

        key('up', () => {
            setDirection(DIRECTION.TOP);
        });

        key('right', () => {
            setDirection(DIRECTION.RIGHT);
        });

        key('down', () => {
            setDirection(DIRECTION.BOTTOM);
        });

        key('left', () => {
            setDirection(DIRECTION.LEFT);
        });
    };

    unBindKeys = () => {
        key.unbind('top');
        key.unbind('right');
        key.unbind('bottom');
        key.unbind('left');
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Если сменился
        if (!prevProps.level && this.props.level) {
            this.doGameTick();
            this.bindKeys();
        }

        if (prevProps.level && !this.props.level) {
            this.pauseGame();
            this.unBindKeys();
        }

        if (!prevProps.pause && this.props.pause) {
            this.pauseGame();
        }

        if (prevProps.pause && !this.props.pause) {
            this.unPauseGame();
        }
    }

    componentWillUnmount() {
        this.pauseGame();
    }

    render() {
        const { pause, gameOver, level } = this.props;

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
                <LabelScreen active={pause} label="Pause" blink />
                <LabelScreen active={gameOver} label="Game Over" />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        pause: state.game.get('pause'),
        level: state.game.get('level'),
        gameOver: state.game.get('gameOver'),
    };
}

export default connect(
    mapStateToProps,
    {
        gameTick,
        setDirection,
    },
)(Board);
