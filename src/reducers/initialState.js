

export const initialStateGame = {
    canvas: Array(6).fill(Array(7).fill(0)), //Holds copy/instance of canvas
    activePlayer: 1, //player who has current turn
    gameOn: false, //game is running
    gameOver: false,  //game has been finished
    activeRow: null,  //row that has been hovered ("column" but as the canvas is being stored transposed its actually the row)
    computerOpponent: false,   //play vs. computer
    animationClass: false,  //used to trigger animation
    animationDepth: 15,    //default animation depth to be modified based on how much the column is occupied already
    difficulty: 0,   //sets difficulty of computer opponent
    offlineMode: true,
    multiplayerMode: false
}

export const initialStateMultiplayer = {
    playersAvailable: [], //All players that are free to play
    opponentId: null, //Id of opponent
    socket: null, //own socket connection,
    requestMode: false,
    playerRequesting: null,
    hasTurn: false
}