import { generate } from "random-words";

const isInVisited = (visited, position) => {
  return visited.some(item => JSON.stringify(item) === JSON.stringify(position));
};

function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomNLetterWord = (n) => {
  return generate({ minLength: n, maxLength: n });
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


// TODO CHANGE THE ORDER OF THE WHILE LOOPS AND REMOVE THE CHARACTERS ALREADY IN THE LONGWORD FROM THE CHARACTERSET
export function generateRandomBoard(rows, cols, longWords) {
  const vowels = ["AEI", "AEIOU"];
  const consonants = ["TSRNLCDH", "BCDFGHJKLMNPQRSTVW"];
  // const niceConsonants = "RSTHLWC";
  let v = vowels[0]
  let c = consonants[0];
  let board = []

  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      let randomChar = '';
      if (j % 2 == 0) {
        if (v.length == 0) {
          v = vowels[1];
        }
        randomChar = v[Math.floor(Math.random() * v.length)];
        v = v.replace(randomChar, '');
      }
      else {
        if (c.length == 0) {
          c = consonants[1];
        }
        randomChar = c[Math.floor(Math.random() * c.length)];
        c = c.replace(randomChar, '');
        console.log("c is now: ", c);
      }
      row.push(randomChar);
    }
    board.push(row);
  }

  if (longWords) {
    const lengthOfWord = (rows * 2) + 1
    const randomWord = getRandomNLetterWord(lengthOfWord);
    console.log("random word is: ", randomWord);
    let startPos = [getRandomIntInRange(0, rows - 1), getRandomIntInRange(0, cols - 1)];
    let d = [[0, 1], [1, 0], [1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1], [-1, 1]];
    let visited = [];
    for (let l = 0; l < lengthOfWord; ++l) {
      d = shuffleArray(d);
      let choose = d[0];
      let newPos = [startPos[0] + choose[0], startPos[1] + choose[1]];
      let attempts = 0;
      while ((newPos[0] < 0 || newPos[0] > rows - 1 || newPos[1] < 0 || newPos[1] > cols - 1) || (isInVisited(visited, newPos))) {
        choose = d[attempts % d.length];
        newPos = [startPos[0] + choose[0], startPos[1] + choose[1]];
        attempts++;
        if (attempts >= 100) {
          console.log("kys");
          break;
        }
      }
      console.log(newPos, randomWord[l].toUpperCase());
      visited.push(newPos);
      board[newPos[0]][newPos[1]] = randomWord[l].toUpperCase();
      startPos = newPos;
    }
  }
  return board;
};

export const spelledCorrectly = (word) => {
  return (word.length > 3);
}
