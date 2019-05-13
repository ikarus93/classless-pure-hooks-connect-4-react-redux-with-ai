//Helper function to compare multidimensional arrays
export const compare = (arr1, arr2) => {
  //Compares two arrays to find out if they are identical
  return arr1.every((row, i) => row.every((field, j) => field === arr2[i][j]));
};

export const transpose = (arr) => {
  //transposes array
  return arr[0].map((_, i) => arr.map(row => row[i]));
}

export const copyArray = (arr) => {
  //deep copies array to prevent double reference and unwanted transformations
  return JSON.parse(JSON.stringify(arr));
}

export const genRandNum = (min, max) => {
  //generates random number between min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getValidLocations = (canvas) => {
  //returns list of rows that have empty spots
  return canvas.map((x, i) => i).filter(i => canvas[i].some(val => !val))
}

export const getDiags = (arr) => {
  //gets the diagonal
  let diags = [];
  for (let i = 0, j = 0, c = false; j < arr[0].length; i++) {
    let [x, y] = [i, j];
    let diag = [];
    while (true) {
      try {
        if (arr[x][y] === undefined) throw new Error();
        diag.push(arr[x][y]);
        x--;
        y++;
      } catch (err) {
        diags.push(diag);
        break;
      }
    }
    if (i === arr.length - 1) {
      j++;
      i--;
    }
  }
  return diags;
}

export const check = (arr, activePlayer) => {
  //checks if specified player has 4 in a row vertically, horizontally or in both diagonals


  const horizontals = copyArray(arr);
  const verticals = arr[0].map((_, i) => arr.map(row => row[i]));
  const [left, right] = [
    getDiags(arr),
    getDiags(arr.map(row => row.reverse()))
  ]; //reverse array to get other diagonal
  //check if any row contains 4 in a row of player and return result
  return [horizontals, verticals, left, right].some(x => {
    return x
      .map(row => {
        row = row.join("");
        return row;
      })
      .some(row => {
        return row.includes(
          Array(4)
            .fill(activePlayer)
            .join("")
        );
      });
  });
};

export const updateCanvas = (i, newArr, activePlayer) => {
  //if row selected by click event handler matches index and there are empty (0) fields in this row, insert activePlayers symbol
  return newArr.map(
    (row, idx) =>
      idx === i && row.some(field => !field)
        ? [
          ...row.slice(1, row.lastIndexOf(0) + 1),
          activePlayer,
          ...row.slice(row.lastIndexOf(0) + 1)
        ]
        : row
  );
};
