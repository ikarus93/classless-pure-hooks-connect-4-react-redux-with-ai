import React, { useState, useContext } from 'react';
import AppContext from "./AppContext"

export default props => {
    //Switch to toggle game state of Ai/human player
    const [on, toggleSwitch] = useState(false);
    const { changeOpponent } = useContext(AppContext);



    return (
        <div className="switch" onClick={() => {
            toggleSwitch(!on);
            changeOpponent();
        }}>
            <input type="checkbox" defaultChecked={on} checked={on} className="switch__input" />
            <span className="switch__slider" />
        </div>
    );
};
