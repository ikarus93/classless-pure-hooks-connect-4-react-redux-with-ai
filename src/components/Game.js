import React, { useReducer, useEffect, Fragment } from 'react';
import ioClient from 'socket.io-client';




//Components
import AppContext from "./AppContext";
import ToggleSwitch from "./ToggleSwitch";
import HoverTable from "./HoverTable";
import Canvas from "./Canvas";
import GameControls from "./GameControls";
import UsersOnlineList from "./UsersOnlineList";

//Helper functions
import { compare, copyArray, transpose, updateCanvas, check, genRandNum } from "../helpers/helpers";
import minimax from "../ai/minimax";


//Reducers related
import { UPDATE_CANVAS, CHANGE_TURN, TOGGLE_GAME_STATUS, START_GAME, RESET_GAME, END_GAME, UPDATE_ACTIVE_ROW, TOGGLE_COMPUTER_OPPONENT, TOGGLE_ANIMATION_CLASS, CHANGE_ANIMATION_DEPTH, TOGGLE_OFFLINE_MODE, ADD_SOCKET, DISCONNECT_SOCKET } from "../reducers/types";
import GameReducer from "../reducers/gameReducer";
import { UPDATE_LIST_OF_ACTIVE_PLAYERS, ADD_OPPONENT, SET_CURRENT_PLAYER_ID } from "../reducers/types";
import MultiplayerReducer from "../reducers/multiplayerReducer";
import { initialStateGame, initialStateMultiplayer } from "../reducers/initialState"


export default props => {
    //Main game component

    //const initialCanvas = Array(6).fill(Array(7).fill(0)); //The initial(empty) canvas
    const [gameState, dispatchGameReducer] = useReducer(GameReducer, initialStateGame);
    const [multiplayerState, dispatchMultiplayerReducer] = useReducer(MultiplayerReducer, initialStateMultiplayer)
    const { activePlayer, computerOpponent, gameOn, gameOver, canvas, difficulty, offlineMode } = gameState;
    const { socket } = multiplayerState;



    useEffect(
        () => {
            //hook to trigger computer round here as I need to await rerendering of canvas component to apply changes made by player, as state setting is asynchronous, only run effect is activePlayer has changed
            if (computerOpponent && activePlayer === 2) {
                computerMakeMove();
            }
        },
        [activePlayer]
    );

    useEffect(
        () => {
            if (!offlineMode) {

                //Sets event listeners for socket instance current player id if socket just connected
                //dispatchMultiplayerReducer({ type: SET_CURRENT_PLAYER_ID, payload: socket.id });

                //event listeners
                socket.on("newUserJoined", updated => dispatchMultiplayerReducer({ type: UPDATE_LIST_OF_ACTIVE_PLAYERS, payload: updated }));
                socket.on("userLeft", updated => dispatchMultiplayerReducer({ type: UPDATE_LIST_OF_ACTIVE_PLAYERS, payload: updated }));

                socket.emit("fetchListOfUsers", ""); //load user list from io
            }
        },
        [socket] //run only if socket variable changes
    );





    const clearGame = () => {
        //Resets game
        dispatchGameReducer({ type: RESET_GAME });
    };

    const changeOpponent = () => {
        //Toggles between ai/human oppoent
        dispatchGameReducer({ type: TOGGLE_COMPUTER_OPPONENT })
    };



    const updateCb = i => {
        //callback that updates canvas and triggers animations after each turn
        dispatchGameReducer({ type: TOGGLE_ANIMATION_CLASS })

        const animationDepth = 15 - ((6 - transpose(copyArray(canvas))[i].filter(x => !x).length) * 2.5);
        dispatchGameReducer({ type: CHANGE_ANIMATION_DEPTH, payload: animationDepth })

        setTimeout(() => {
            dispatchGameReducer({ type: TOGGLE_ANIMATION_CLASS });
            if (gameOn) {

                let newArr = transpose(copyArray(canvas)); //transpose to append field to row
                let copyToCompare = copyArray(newArr); //used to compare if any changes occured and move was valid
                newArr = updateCanvas(i, newArr, activePlayer);
                dispatchGameReducer({ type: UPDATE_CANVAS, payload: transpose(newArr) }); //retranspose the array and update state
                //If any player has 4 in a row end game

                if (check(transpose(newArr), activePlayer)) {
                    dispatchGameReducer({ type: END_GAME });

                } else {
                    //compare is coin could have been placed and array changed appearance, only then change turn
                    if (!compare(copyToCompare, newArr)) {
                        dispatchGameReducer({ type: CHANGE_TURN });
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

            dispatchGameReducer({ type: UPDATE_CANVAS, payload: transpose(newArr) })

            if (check(transpose(newArr), activePlayer)) {
                dispatchGameReducer({ type: END_GAME })
            } else {
                dispatchGameReducer({ type: CHANGE_TURN });
            }

        }, 1000);
    };


    const toggleOfflineMode = () => {
        //Toggles mode for player wanting to play online
        if (offlineMode) {
            //Create socket connection and add to reducer
            let newSocket = ioClient("/");
            dispatchMultiplayerReducer({ type: ADD_SOCKET, payload: newSocket });
        } else {
            //Disconnect user
            socket.disconnect();
            dispatchMultiplayerReducer({ type: DISCONNECT_SOCKET })
        }

        dispatchGameReducer({ type: TOGGLE_OFFLINE_MODE }); //for updating ui

    }


    return (
        <Fragment>
            <AppContext.Provider value={{ state: { ...gameState, ...multiplayerState }, dispatchGameReducer, dispatchMultiplayerReducer, changeOpponent, updateCb }}>
                {offlineMode &&
                    <div className="opponent-changer">
                        <h4>Play against {computerOpponent ? "Computer" : "Human"} </h4>
                        <ToggleSwitch />
                    </div>}
                <button className="btn--toggle--offline--mode" onClick={toggleOfflineMode}>{offlineMode ? "Play Online" : "Play Offline"}</button>
                {computerOpponent &&
                    <div className="game-controls">
                        <GameControls />
                    </div>}
                {!gameOn &&
                    !gameOver && (
                        <button
                            className="btn--toggle--game--status"
                            onClick={() => { dispatchGameReducer({ type: TOGGLE_GAME_STATUS }) }}
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
                {!offlineMode &&
                    <UsersOnlineList />}
            </AppContext.Provider>
        </Fragment >
    );
};