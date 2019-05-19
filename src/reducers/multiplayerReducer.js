import { UPDATE_LIST_OF_ACTIVE_PLAYERS, ADD_OPPONENT, ADD_SOCKET, DISCONNECT_SOCKET } from "./types";
import { initialStateMultiplayer } from './initialState';
export default (state, action) => {
    switch (action.type) {
        case UPDATE_LIST_OF_ACTIVE_PLAYERS:
            return { ...state, playersAvailable: action.payload };

        case ADD_OPPONENT:
            return { ...state, opponentId: action.payload };

        case ADD_SOCKET:
            return { ...state, socket: action.payload };

        case DISCONNECT_SOCKET:
            return initialStateMultiplayer;
    }
}
