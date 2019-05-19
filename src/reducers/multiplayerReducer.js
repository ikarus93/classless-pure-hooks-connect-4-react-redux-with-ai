import { ADD_PLAYER_TO_TABLE, REMOVE_PLAYER_FROM_TABLE, ADD_OPPONENT } from "./types";
import { initialStateMultiplayer } from "./initialState";

export default (state, action) => {
    switch (action.type) {
        case ADD_PLAYER_TO_TABLE:
            return { ...state, playersAvailable: [...playersAvailable, action.payload] };

        case REMOVE_PLAYER_FROM_TABLE:
            return { ...state, playersAvailable: state.playersAvailable.filter(player => player.id !== action.payload) };

        case ADD_OPPONENT:
            return { ...state, opponentId: action.payload };
    }
}
