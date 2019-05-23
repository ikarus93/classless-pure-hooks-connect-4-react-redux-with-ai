import React, { useContext } from 'react';
import AppContext from "./AppContext";

const ListEntry = ({ player, cb }) => {
    return (<li onClick={cb.bind(null, player)}>{player}</li>)
}

export default props => {

    const { state: { playersAvailable, socket, requestMode }, dispatchMultiplayerReducer } = useContext(AppContext);

    const requestMatch = opponentId => {
        if (!requestMode) {
            socket.emit('requestMatch', opponentId);
        }
    }
    return (<ul>{playersAvailable.filter(x => x !== socket.id).map(player => {
        return <ListEntry player={player} cb={requestMatch} />
    })}</ul>)
}
