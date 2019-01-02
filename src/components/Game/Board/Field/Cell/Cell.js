import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { CELL_MARGIN_PX, CELL_SIZE_PX, CELL_TYPES } from '../../../../../constants/game';

export class Cell extends React.Component {
    static propTypes = {
        cellType: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
    };

    render() {
        const { x, y, cellType, isSnakeHead } = this.props;

        let cellClassName;

        switch (cellType) {
            case CELL_TYPES.BLANK: {
                cellClassName = styles.blankCell;
                break;
            }
            case CELL_TYPES.SNAKE: {
                cellClassName = styles.snakeCell;
                break;
            }
            case CELL_TYPES.FRUIT: {
                cellClassName = styles.fruitCell;
                break;
            }
            default:
        }

        return (
            <div
                className={classNames(styles.cell, cellClassName, { [styles.snakeHead]: isSnakeHead })}
                style={{
                    left: CELL_MARGIN_PX + x * (CELL_SIZE_PX + CELL_MARGIN_PX),
                    top: CELL_MARGIN_PX + y * (CELL_SIZE_PX + CELL_MARGIN_PX),
                    width: CELL_SIZE_PX,
                    height: CELL_SIZE_PX,
                }}
            />
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { y, x } = ownProps;

    return {
        cellType: state.game.getIn(['cells', y, x]),
        isSnakeHead: state.game.getIn(['snakeCells', 0, 0]) === y && state.game.getIn(['snakeCells', 0, 1]) === x,
    };
}

export default connect(
    mapStateToProps,
    {},
)(Cell);
