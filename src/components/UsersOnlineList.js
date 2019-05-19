import React, { useContext } from 'react';
import AppContext from "./AppContext";

const ListEntry = ({ name, cb }) => {
    return (<li>{name}</li>)
}

export default props => {

    const { state: { playersAvailable, socket }, dispatchMultiplayerReducer } = useContext(AppContext);

    console.log(playersAvailable)

    return (<ul>{playersAvailable.filter(x => x !== socket.id).map(player => {
        return <ListEntry name={player} />
    })}</ul>)
}
