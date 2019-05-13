
import { check, copyArray, transpose, updateCanvas, getValidLocations, genRandNum, getDiags } from "../helpers/helpers";


function scorePosition(canvas, player) {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;

    const horizontals = [...canvas];
    const verticals = transpose(copyArray(canvas)).map(x => x.reverse());
    const [left, right] = [
        getDiags(canvas),
        getDiags(copyArray(canvas).map(row => row.reverse()))
    ];

    score += verticals[3].filter(x => x === player).length * 5;


    [horizontals, verticals, left, right].forEach(arr => {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < 4; j++) {
                let window = arr[i].slice(j, j + 4);
                switch (window.filter(x => x === player).length) {
                    case 4:
                        score += 100;
                    case 3:
                        if (window.includes(0)) {
                            score += 10
                        };
                    case 2:
                        if (window.filter(x => !x).length === 2) {
                            score += 5;
                        }
                };

                if (window.filter(x => x === opponent).length === 3 && window.includes(0)) {
                    score -= 10;
                }
            }
        }
    })

    return score
}


//AI related
export default function minimax(canvas, depth, maxPlayer) {
    let validLocations = getValidLocations(transpose(canvas)); //get free rows in canvas
    let isTerminal = !validLocations.length || check(canvas, 2) || check(canvas, 1); //determine whether canvas has reached terminal limit


    if (!depth || isTerminal) {
        //if depth is at 0 or game terminated
        if (isTerminal) {
            if (check(canvas, 2)) {
                //if computer 
                return [null, 1000]
            } else if (check(canvas, 1)) {
                //if player
                return [null, -1000]
            } else {
                //if draw
                return [null, 0]
            }
        }
        //on zero depth similar to draw
        return [null, scorePosition(canvas, 2)]
    }

    canvas = transpose(canvas); //transpose to apply canvas state change

    if (maxPlayer) {
        //if computer round
        let val = -Infinity;
        let col = genRandNum(0, 6);
        //iterate over possible columns
        for (let j = 0; j < validLocations.length; j++) {
            //apply move and copy array to prevent memory location issues
            let copy = updateCanvas(validLocations[j], copyArray(canvas), 2);

            //result of recursive check
            let res = minimax(transpose(copy), depth - 1, false)[1];

            //if computer had success choosing this column
            if (res > val) {
                //apply values
                [col, val] = [validLocations[j], res]
            }
        }
        return [col, val]

    } else {
        //same as above but reversed for player round and negative(min)
        let val = Infinity;
        let col = genRandNum(0, 6);
        for (let j = 0; j < validLocations.length; j++) {
            let copy = updateCanvas(validLocations[j], copyArray(canvas), 1);
            let res = minimax(transpose(copy), depth - 1, true)[1]
            if (res < val) {
                [col, val] = [validLocations[j], res]
            }
        }
        return [col, val]
    }
}