import { UPDATE_LIST_OF_ACTIVE_PLAYERS, ADD_OPPONENT, SET_CURRENT_PLAYER_ID } from "./types";

export default (state, action) => {
    switch (action.type) {
        case UPDATE_LIST_OF_ACTIVE_PLAYERS:
            return { ...state, playersAvailable: action.payload };

        case ADD_OPPONENT:
            return { ...state, opponentId: action.payload };

        case SET_CURRENT_PLAYER_ID:
            return { ...state, currentPlayerId: action.payload }
    }
}
