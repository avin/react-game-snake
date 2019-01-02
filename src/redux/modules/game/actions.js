import * as Immutable from 'immutable';
import { SET_GAME_STATE, PAUSE_GAME, SET_LEVEL, SET_DIRECTION } from './actionTypes';
import { CELL_TYPES, DIRECTION, FIELD_SIZE } from '../../../constants/game';

/**
 * Получить координаты для размещения фрукта
 * @param cells
 * @returns {*}
 */
function getRandomFruitPosition(cells) {
    // Собираем все ячейкт которые не являеются змейкой
    const positions = [];
    cells.forEach((row, y) => {
        row.forEach((cellValue, x) => {
            if (cellValue === CELL_TYPES.BLANK) {
                positions.push([y, x]);
            }
        });
    });

    // Выбираем случайную позицию
    return positions[Math.floor(Math.random() * positions.length)];
}

/**
 * Сегерировать клетки для изначального состояния
 * @returns {{cells: any, snakeCells: List}}
 */
function getInitCellPositions() {
    const center = Math.floor(FIELD_SIZE / 2);

    let snakeCells = new Immutable.List();

    let cells = Immutable.fromJS(Array(FIELD_SIZE).fill(Array(FIELD_SIZE).fill(CELL_TYPES.BLANK)));

    // Размещаем змею
    for (let i = 0; i < 3; i += 1) {
        cells = cells.setIn([center + i, center], CELL_TYPES.SNAKE);
        snakeCells = snakeCells.push(new Immutable.List([center + i, center]));
    }

    const fruitPosition = getRandomFruitPosition(cells);
    cells = cells.setIn(fruitPosition, CELL_TYPES.FRUIT);

    return { cells, snakeCells };
}

/**
 * Рестартануть игру
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
        .set('direction', DIRECTION.TOP);

    return {
        type: SET_GAME_STATE,
        state,
    };
}

/**
 * Поставить на паузу
 * @param value
 * @returns {{type: string, value: *}}
 */
export function pauseGame(value) {
    return {
        type: PAUSE_GAME,
        value,
    };
}

export function changeLevel(level) {
    return {
        type: SET_LEVEL,
        level,
    };
}

function checkCrash(position, cells) {
    // Врезались в стенку
    if (position[0] < 0 || position[0] > FIELD_SIZE - 1 || position[1] < 0 || position[1] > FIELD_SIZE - 1) {
        return true;
    }

    // Врезались в самого себя или
    if (cells.getIn(position) === CELL_TYPES.SNAKE) {
        return true;
    }

    return false;
}

/**
 * Совершить одну итерацию в игре
 */
export function gameTick() {
    return (dispatch, getState) => {
        let { game } = getState();

        const gameOver = game.get('gameOver');

        if (gameOver) {
            return;
        }

        const direction = game.get('direction');
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

        // Проверяем если врезались
        if (checkCrash(target, cells)) {
            const { cells, snakeCells } = getInitCellPositions();

            const lives = game.get('lives');
            if (lives > 1) {
                // Уменьшаем жизни и продолжаем
                game = game
                    .set('snakeCells', snakeCells)
                    .set('cells', cells)
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

        // Проверяем если съели фрукт
        const fruitEaten = cells.getIn(target) === CELL_TYPES.FRUIT;

        snakeCells = snakeCells.unshift(new Immutable.List(target));
        cells = cells.setIn(target, CELL_TYPES.SNAKE);

        // Если не был съеден фрукт - убираем последнюю клетку змеи
        if (fruitEaten) {
            // Рисуем новый фрукт
            const fruitPosition = getRandomFruitPosition(cells);
            cells = cells.setIn(fruitPosition, CELL_TYPES.FRUIT);
        } else {
            // Убираем последнюю клетку
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
 * Выставить направление движения (с проверкой возможности туда двигаться)
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
