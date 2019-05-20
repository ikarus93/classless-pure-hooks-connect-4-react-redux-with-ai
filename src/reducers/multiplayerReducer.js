import { UPDATE_LIST_OF_ACTIVE_PLAYERS, ADD_OPPONENT, ADD_SOCKET, DISCONNECT_SOCKET, REQUEST_MATCH, ACCEPT_MATCH, REJECT_MATCH } from "./types";
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
            return { ...state, requestMode: true };

        case REJECT_MATCH:
            return { ...state, requestMode: false };

        case ACCEPT_MATCH:
            return { ...state, requestMode: false, opponentId: action.payload };
    }
}
