import * as Immutable from 'immutable';
import { SET_GAME_STATE, PAUSE_GAME, SET_LEVEL, SET_DIRECTION } from './actionTypes';
import { DIRECTION } from '../../../constants/game';

const initialState = new Immutable.Map({
    pause: false,
    gameOver: false,
    score: null,
    level: null,
    lives: null,
    cells: null,
    snakeCells: null,
    nextLevelCountdown: null,
    direction: DIRECTION.TOP,
});

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_GAME_STATE: {
            return action.state;
        }
        case PAUSE_GAME: {
            const { value } = action;
            return state.set('pause', value);
        }
        case SET_LEVEL: {
            const { level } = action;
            return state.set('level', level);
        }
        case SET_DIRECTION: {
            const { direction } = action;
            return state.set('direction', direction);
        }
        default:
            return state;
    }
}
