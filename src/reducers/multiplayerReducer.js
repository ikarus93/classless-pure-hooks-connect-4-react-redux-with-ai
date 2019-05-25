import { UPDATE_LIST_OF_ACTIVE_PLAYERS, ADD_OPPONENT, ADD_SOCKET, DISCONNECT_SOCKET, REQUEST_MATCH, ACCEPT_MATCH, REJECT_MATCH, TOGGLE_ACTIVE_ROUND } from "./types";
import { initialStateMultiplayer } from './initialState';
export default (state, action) => {
    switch (action.type) {
        case UPDATE_LIST_OF_ACTIVE_PLAYERS:
            return { ...state, playersAvailable: action.payload };

        case ADD_SOCKET:
            return { ...state, socket: action.payload };

        case DISCONNECT_SOCKET:
            return initialStateMultiplayer;

        case REQUEST_MATCH:
            return { ...state, requestMode: true, playerRequesting: action.payload };

        case REJECT_MATCH:
            return { ...state, requestMode: false, playerRequesting: null };

        case ACCEPT_MATCH:
            return { ...state, requestMode: false, opponentId: state.playerRequesting };

        case TOGGLE_ACTIVE_ROUND:
            return { ...state, hasTurn: !state.hasTurn }
    }
}
