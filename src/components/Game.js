import React, { useReducer, useEffect, Fragment } from 'react';
import ioClient from 'socket.io-client'



//Components
import AppContext from "./AppContext";
import ToggleSwitch from "./ToggleSwitch";
import HoverTable from "./HoverTable";
import Canvas from "./Canvas";
import GameControls from "./GameControls";

//Helper functions
import { compare, copyArray, transpose, updateCanvas, check, genRandNum } from "../helpers/helpers";
import minimax from "../ai/minimax";


//Reducers/Reduce related
import { UPDATE_CANVAS, CHANGE_TURN, TOGGLE_GAME_STATUS, START_GAME, RESET_GAME, END_GAME, UPDATE_ACTIVE_ROW, TOGGLE_COMPUTER_OPPONENT, TOGGLE_ANIMATION_CLASS, CHANGE_ANIMATION_DEPTH } from "../reducers/types";
import GameReducer from "../reducers/gameReducer"
import { initialState } from "../reducers/initialState"


export default props => {
    //Main game component


    //const initialCanvas = Array(6).fill(Array(7).fill(0)); //The initial(empty) canvas
    const [state, dispatch] = useReducer(GameReducer, initialState);
    const { canvas, activePlayer, gameOn, gameOver, activeRow, computerOpponent, animationClass, animationDepth, difficulty } = state;
    let io = ioClient('http://localhost:3000');

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
        dispatch({ type: RESET_GAME });
    };

    const changeOpponent = () => {
        //Toggles between ai/human oppoent
        dispatch({ type: TOGGLE_COMPUTER_OPPONENT })
    };



    const updateCb = i => {
        //callback that updates canvas and triggers animations after each turn
        dispatch({ type: TOGGLE_ANIMATION_CLASS })

        const animationDepth = 15 - ((6 - transpose(copyArray(canvas))[i].filter(x => !x).length) * 2.5);
        dispatch({ type: CHANGE_ANIMATION_DEPTH, payload: animationDepth })

        setTimeout(() => {
            dispatch({ type: TOGGLE_ANIMATION_CLASS });
            if (gameOn) {

                let newArr = transpose(copyArray(canvas)); //transpose to append field to row
                let copyToCompare = copyArray(newArr); //used to compare if any changes occured and move was valid
                newArr = updateCanvas(i, newArr, activePlayer);
                dispatch({ type: UPDATE_CANVAS, payload: transpose(newArr) }); //retranspose the array and update state
                //If any player has 4 in a row end game

                if (check(transpose(newArr), activePlayer)) {
                    dispatch({ type: END_GAME });

                } else {
                    //compare is coin could have been placed and array changed appearance, only then change turn
                    if (!compare(copyToCompare, newArr)) {
                        dispatch({ type: CHANGE_TURN });
                    }
                }
            }
        }, 1000)
        //Triggers canvas updating if game is running

    };

    const computerMakeMove = () => {
        setTimeout(() => {

            let newArr = transpose(copyArray(canvas));
            let copyToCompare = copyArray(newArr);
            let res;

            do {
                //If difficulty 0, or difficulty is medium and generate random number is 1 (50% chance of generating a Random number for endresult as previous attempts of running the algorithm with depth of 2 was still too difficult)  generate random number, else call minimax with adjusted depth based on difficulty level
                res = !difficulty || (difficulty === 1 && genRandNum(0, 1)) ? genRandNum(0, 6) : minimax(canvas, 3, true)[0];
                newArr = updateCanvas(res, newArr, 2);
            } while (compare(copyToCompare, newArr)); //comparing used to determine if random number chosen can be applied to any column that still has space left for coin

            dispatch({ type: UPDATE_CANVAS, payload: transpose(newArr) })

            if (check(transpose(newArr), activePlayer)) {
                dispatch({ type: END_GAME })
            } else {
                dispatch({ type: CHANGE_TURN });
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
        animationDepth,
        difficulty
    }; //State to be injected into apps context

    return (
        <Fragment>
            <AppContext.Provider value={gameState}>
                <div className="opponent-changer">
                    <h4>Play against {computerOpponent ? "Computer" : "Human"} </h4>
                    <ToggleSwitch />
                </div>{" "}
                {computerOpponent &&
                    <div className="game-controls">
                        <GameControls />
                    </div>}
                {!gameOn &&
                    !gameOver && (
                        <button
                            className="btn btn-danger"
                            onClick={() => { dispatch({ type: TOGGLE_GAME_STATUS }) }}
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