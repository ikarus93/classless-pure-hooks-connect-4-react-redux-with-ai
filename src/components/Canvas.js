import React, { useContext } from 'react';
import AppContext from "./AppContext";

import { UPDATE_ACTIVE_ROW } from "../reducers/types"


const Field = ({ j, val }) => {
    //Single field that in canvas
    const { updateCb, dispatchGameReducer, hasTurn, multiplayerMode } = React.useContext(AppContext);
    const canMove = hasTurn || !multiplayerMode ? true : false;
    return (
        <td
            className={`table__field ${"table__active" + val}`} //if occupied by any player adds valid css class
            onClick={canMove ? updateCb.bind(null, j) : ""}
            //mouse events used to show hover table piece on top of canvas
            onMouseEnter={() => { canMove ? dispatchGameReducer({ type: UPDATE_ACTIVE_ROW, payload: j + 1 }) : "" }}
            onMouseLeave={() => { canMove ? dispatchGameReducer({ type: UPDATE_ACTIVE_ROW, payload: null }) : "" }}
        />
    );
};

const Row = ({ i, row }) => {
    //Row of Fields
    return <tr>{row.map((field, j) => <Field key={j} j={j} val={field} />)}</tr>;
};

export default ({ canvas }) => {
    //Game Canvas, table of canvas fields
    return (
        <table className="table">
            {canvas.map((row, i) => <Row key={i} row={row} i={i} />)}
        </table>
    );
};