import * as Immutable from 'immutable';
import { SET_GAME_STATE, PAUSE_GAME, SET_LEVEL, SET_DIRECTION } from './actionTypes';
import { CELL_TYPES, DIRECTION, FIELD_SIZE, FRUITS_PER_LEVEL } from '../../../constants/game';
import { randomArrayElement } from '../../../utils/helpers';

/**
 * Get coordinates for apple
 * @param cells
 * @returns {*}
 */
function getRandomFruitPosition(cells) {
    // All free cells
    const allPositions = [];
    // Best positions for placing
    const bestPositions = [];
    cells.forEach((row, y) => {
        row.forEach((cellValue, x) => {
            if (cellValue === CELL_TYPES.BLANK) {
                allPositions.push([y, x]);

                // Don't touch borders
                if (y > 0 && y < FIELD_SIZE - 1 && x > 0 && x < FIELD_SIZE - 1) {
                    bestPositions.push([y, x]);
                }
            }
        });
    });

    // Get random position
    if (bestPositions.length) {
        return randomArrayElement(bestPositions);
    }
    return randomArrayElement(allPositions);
}

/**
 * Get cells for init state
 * @returns {{cells: any, snakeCells: List}}
 */
function getInitCellPositions() {
    const center = Math.floor(FIELD_SIZE / 2);

    let snakeCells = new Immutable.List();

    let cells = Immutable.fromJS(Array(FIELD_SIZE).fill(Array(FIELD_SIZE).fill(CELL_TYPES.BLANK)));

    // Place snake
    for (let i = 0; i < 3; i += 1) {
        cells = cells.setIn([center + i, center], CELL_TYPES.SNAKE);
        snakeCells = snakeCells.push(new Immutable.List([center + i, center]));
    }

    const fruitPosition = getRandomFruitPosition(cells);
    cells = cells.setIn(fruitPosition, CELL_TYPES.FRUIT);

    return { cells, snakeCells };
}

/**
 * Restart game
 * @returns {{type: string}}
 */
export function restartGame() {
    const { cells, snakeCells } = getInitCellPositions();

    const state = new Immutable.Map()
        .set('pause', false)
        .set('gameOver', false)
        .set('level', 1)
        .set('lives', 3)
        .set('score', 0)
        .set('cells', cells)
        .set('snakeCells', snakeCells)
        .set('nextLevelCountdown', FRUITS_PER_LEVEL)
        .set('direction', DIRECTION.TOP);

    return {
        type: SET_GAME_STATE,
        state,
    };
}

/**
 * Pause game
 * @param value
 * @returns {{type: string, value: *}}
 */
export function pauseGame(value) {
    return {
        type: PAUSE_GAME,
        value,
    };
}

/**
 * Change level
 * @param level
 * @returns {{level: *, type: string}}
 */
export function changeLevel(level) {
    return {
        type: SET_LEVEL,
        level,
    };
}

/**
 * Check collision
 * @param position
 * @param cells
 * @returns {boolean}
 */
function checkCrash(position, cells) {
    // Touch borders
    if (position[0] < 0 || position[0] > FIELD_SIZE - 1 || position[1] < 0 || position[1] > FIELD_SIZE - 1) {
        return true;
    }

    // Touch myself
    if (cells.getIn(position) === CELL_TYPES.SNAKE) {
        return true;
    }

    return false;
}

/**
 * Game tick
 */
export function gameTick() {
    return (dispatch, getState) => {
        let { game } = getState();

        const gameOver = game.get('gameOver');
        const pause = game.get('pause');

        if (gameOver || pause) {
            return;
        }

        const direction = game.get('direction');
        const score = game.get('score');
        const level = game.get('level');
        const nextLevelCountdown = game.get('nextLevelCountdown');
        let snakeCells = game.get('snakeCells');
        let cells = game.get('cells');

        const headPosition = snakeCells.get(0);

        let target;
        switch (direction) {
            case DIRECTION.TOP: {
                target = [headPosition.get(0) - 1, headPosition.get(1)];
                break;
            }
            case DIRECTION.RIGHT: {
                target = [headPosition.get(0), headPosition.get(1) + 1];
                break;
            }
            case DIRECTION.BOTTOM: {
                target = [headPosition.get(0) + 1, headPosition.get(1)];
                break;
            }
            case DIRECTION.LEFT: {
                target = [headPosition.get(0), headPosition.get(1) - 1];
                break;
            }
            default:
        }

        // Check collision
        if (checkCrash(target, cells)) {
            const { cells, snakeCells } = getInitCellPositions();

            const lives = game.get('lives');
            if (lives > 1) {
                // Decrease lives and continue
                game = game
                    .set('snakeCells', snakeCells)
                    .set('cells', cells)
                    .set('direction', DIRECTION.TOP)
                    .set('lives', lives - 1);
            } else {
                // Game Over!
                game = game.set('gameOver', true).set('lives', 0);
            }

            return dispatch({
                type: SET_GAME_STATE,
                state: game,
            });
        }

        // Check if apple has been eaten
        const fruitEaten = cells.getIn(target) === CELL_TYPES.FRUIT;

        snakeCells = snakeCells.unshift(new Immutable.List(target));
        cells = cells.setIn(target, CELL_TYPES.SNAKE);

        // If apple has been eaten  - remove last snake's cell
        if (fruitEaten) {
            // Draw a new apple
            const fruitPosition = getRandomFruitPosition(cells);
            cells = cells.setIn(fruitPosition, CELL_TYPES.FRUIT);

            // Increase score
            game = game.set('score', score + 10);

            if (nextLevelCountdown > 1) {
                game = game.set('nextLevelCountdown', nextLevelCountdown - 1);
            } else {
                game = game.set('nextLevelCountdown', FRUITS_PER_LEVEL);
                game = game.set('level', level + 1);
            }
        } else {
            // Remove last cell
            const endPosition = snakeCells.get(snakeCells.size - 1).toJS();
            snakeCells = snakeCells.pop();
            cells = cells.setIn(endPosition, CELL_TYPES.BLANK);
        }

        game = game.set('snakeCells', snakeCells).set('cells', cells);

        dispatch({
            type: SET_GAME_STATE,
            state: game,
        });
    };
}

/**
 * Set move direction (with testing ability to move there)
 * @param direction
 * @returns {Function}
 */
export function setDirection(direction) {
    return (dispatch, getState) => {
        const headPosition = getState().game.getIn(['snakeCells', 0]);
        const cells = getState().game.get('cells');
        let allow = true;
        switch (direction) {
            case DIRECTION.TOP: {
                allow = cells.getIn([headPosition.get(0) - 1, headPosition.get(1)]) !== CELL_TYPES.SNAKE;
                break;
            }
            case DIRECTION.RIGHT: {
                allow = cells.getIn([headPosition.get(0), headPosition.get(1) + 1]) !== CELL_TYPES.SNAKE;
                break;
            }
            case DIRECTION.BOTTOM: {
                allow = cells.getIn([headPosition.get(0) + 1, headPosition.get(1)]) !== CELL_TYPES.SNAKE;
                break;
            }
            case DIRECTION.LEFT: {
                allow = cells.getIn([headPosition.get(0), headPosition.get(1) - 1]) !== CELL_TYPES.SNAKE;
                break;
            }
            default:
        }
        if (allow) {
            dispatch({
                type: SET_DIRECTION,
                direction,
            });
        }
    };
}
