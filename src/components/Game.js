import React, { useReducer, useEffect, Fragment } from 'react';
import AppContext from "./AppContext";
import ToggleSwitch from "./ToggleSwitch";
import HoverTable from "./HoverTable";
import Canvas from "./Canvas";
import { compare, copyArray, transpose, updateCanvas, check } from "../helpers/helpers";
import minimax from "../ai/minimax";

import { UPDATE_CANVAS, CHANGE_TURN, TOGGLE_GAME_STATUS, START_GAME, RESET_GAME, END_GAME, UPDATE_ACTIVE_ROW, TOGGLE_COMPUTER_OPPONENT, TOGGLE_ANIMATION_CLASS, CHANGE_ANIMATION_DEPTH } from "../reducers/types";
import GameReducer from "../reducers/gameReducer"




const initialState = {
    canvas: Array(6).fill(Array(7).fill(0)), //Holds copy/instance of canvas
    activePlayer: 1, //player who has current turn
    gameOn: false, //game is running
    gameOver: false,  //game has been finished
    activeRow: null,  //row that has been hovered ("column" but as the canvas is being stored transposed its actually the row)
    computerOpponent: false,   //play vs. computer
    animationClass: false,  //used to trigger animation
    animationDepth: 15    //default animation depth to be modified based on how much the column is occupied already
}


export default props => {
    //Main game component


    const initialCanvas = Array(6).fill(Array(7).fill(0)); //The initial(empty) canvas
    const [state, dispatch] = useReducer(GameReducer, initialState);
    const { canvas, activePlayer, gameOn, gameOver, activeRow, computerOpponent, animationClass, animationDepth } = state;

    useEffect(
        () => {
            //hook to trigger computer round here as I need to await rerendering of canvas component to apply changes made by player, as state setting is asynchronous, only run effect is activePlayer has changed
            if (computerOpponent && activePlayer === 2) {
                computerMakeMove();
            }
        },
        [activePlayer]
    );

    const clearGame = () => {
        //Resets game
        dispatch({ type: "resetGame" });
    };

    const changeOpponent = () => {
        //Toggles between ai/human oppoent
        clearGame();
        dispatch({ type: "toggleComputerOpponent" })
    };



    const updateCb = i => {
        //callback that updates canvas and triggers animations after each turn

        dispatch({ type: "toggleAnimationClass" })
        const animationDepth = 15 - ((6 - transpose(copyArray(canvas))[i].filter(x => !x).length) * 2.5);
        dispatch({ type: "changeAnimationDepth", payload: animationDepth })
        setTimeout(() => {
            dispatch({ type: "toggleAnimationClass" })
            if (gameOn) {
                let newArr = transpose(copyArray(canvas)); //transpose to append field to row
                let copyToCompare = copyArray(newArr); //used to compare if any changes occured and move was valid
                newArr = updateCanvas(i, newArr, activePlayer);
                dispatch({ type: "updateCanvas", payload: transpose(newArr) }); //retranspose the array and update state
                //If any player has 4 in a row end game
                if (check(transpose(newArr), activePlayer)) {
                    dispatch({ type: "endGame" })
                } else {
                    //compare is coin could have been placed and array changed appearance, only then change turn
                    if (!copyToCompare.compare(newArr)) {
                        dispatch({ type: "changeTurn" })
                    }
                }
            }
        }, 1000)
        //Triggers canvas updating if game is running

    };

    const computerMakeMove = () => {
        setTimeout(() => {
            /*      let copyToCompare = copyArray(newArr);
                  do {
                    newArr = updateCanvas(genRandNum(0, 6), newArr, activePlayer);
                  } while (copyToCompare.compare(newArr));
                      */
            let newArr = transpose(copyArray(canvas));
            let res = minimax(canvas, 3, true)[0];
            newArr = updateCanvas(res, newArr, 2);
            dispatch({ type: "updateCanvas", payload: transpose(newArr) })
            if (check(transpose(newArr), activePlayer)) {
                dispatch({ type: "endGame" })
            } else {

                dispatch({ type: "changeTurn" });
            }

        }, 1000);
    };

    const gameState = {
        canvas,
        gameOn,
        updateCb,
        activePlayer,
        activeRow,
        changeOpponent,
        dispatch,
        animationClass,
        animationDepth
    }; //State to be injected into apps context

    return (
        <Fragment>
            <AppContext.Provider value={gameState}>
                <div className="opponent-changer">
                    <h4>Play against {computerOpponent ? "Computer" : "Human"} </h4>
                    <ToggleSwitch />
                </div>{" "}
                {!gameOn &&
                    !gameOver && (
                        <button
                            className="btn btn-danger"
                            onClick={() => { dispatch({ type: "toggleGameStatus" }) }}
                        >
                            Start
              </button>
                    )}
                {gameOn || gameOver ? (
                    <button className="btn btn-danger" onClick={clearGame}>
                        Reset
            </button>
                ) : (
                        ""
                    )}
                <HoverTable />
                <Canvas canvas={canvas} />
                {gameOver && (
                    <h4 className={`msg ${"msg" + activePlayer}`}>
                        This round goes to{" "}
                        {!computerOpponent || activePlayer === 1
                            ? "Player" + activePlayer
                            : "Computer"}
                    </h4>
                )}
                {gameOn && (
                    <h4 className={`msg msg__activePlayerTurn ${"msg" + activePlayer}`}>
                        {!computerOpponent || activePlayer === 1
                            ? "Player" + activePlayer
                            : "Computers"}{" "}
                        Turn
            </h4>
                )}
            </AppContext.Provider>
        </Fragment>
    );
};