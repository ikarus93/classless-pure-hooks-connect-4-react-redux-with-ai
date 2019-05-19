import React, { useContext, useState } from "react";
import AppContext from "./AppContext"

import { CHANGE_DIFFICULTY } from "../reducers/types"

export default props => {
    const { state: { difficulty }, dispatchGameReducer
    } = useContext(AppContext);

    return (<div>
        <h4>Difficulty Level of AI opponent</h4>
        <span>Easy</span> <input type="range" min="0" max="2" value={difficulty} name="range" onChange={(e) => { dispatchGameReducer({ type: CHANGE_DIFFICULTY, payload: +e.target.value }) }} /> <span>Hard</span>
    </div >)

}