import React, { useContext } from 'react';
import AppContext from "./AppContext";


const Field = ({ j, val }) => {
    //Single field that in canvas
    const { updateCb, updateActiveRow, updateAnimationClass } = useContext(AppContext);
    return (
        <td
            className={`table__field ${"table__active" + val}`} //if occupied by any player adds valid css class
            onClick={updateCb.bind(null, j)}
            //mouse events used to show hover table piece on top of canvas
            onMouseEnter={updateActiveRow.bind(null, j + 1)}
            onMouseLeave={updateActiveRow.bind(null, null)}
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