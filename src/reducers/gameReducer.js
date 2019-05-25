import { UPDATE_CANVAS, CHANGE_TURN, TOGGLE_GAME_STATUS, START_GAME, RESET_GAME, END_GAME, UPDATE_ACTIVE_ROW, TOGGLE_COMPUTER_OPPONENT, TOGGLE_ANIMATION_CLASS, CHANGE_ANIMATION_DEPTH, CHANGE_DIFFICULTY, TOGGLE_OFFLINE_MODE, ENABLE_MULTIPLAYER_MODE } from "./types";
import { initialStateGame } from "./initialState"



export default (state, action) => {
    switch (action.type) {
        case UPDATE_CANVAS:
            return { ...state, canvas: [...action.payload] };
        case CHANGE_TURN:
            return { ...state, activePlayer: state.activePlayer === 1 ? 2 : 1 };
        case TOGGLE_GAME_STATUS:
            return { ...state, gameOn: !state.gameOn };
        case START_GAME:
            return { ...state, gameOn: true, gameOver: false };
        case RESET_GAME:
            return { ...initialStateGame, multiplayerMode: state.multiplayerMode };
        case END_GAME:
            return { ...state, gameOn: false, gameOver: true };
        case UPDATE_ACTIVE_ROW:
            return { ...state, activeRow: action.payload };
        case TOGGLE_COMPUTER_OPPONENT:
            return { ...initialStateGame, computerOpponent: !state.computerOpponent };
        case TOGGLE_ANIMATION_CLASS:
            return { ...state, animationClass: !state.animationClass };
        case CHANGE_ANIMATION_DEPTH:
            return { ...state, animationDepth: action.payload };
        case CHANGE_DIFFICULTY:
            return { ...state, difficulty: action.payload };
        case TOGGLE_OFFLINE_MODE:
            return { ...state, offlineMode: !state.offlineMode };
        case ENABLE_MULTIPLAYER_MODE:
            return { ...state, multiplayerMode: true };

    }
}