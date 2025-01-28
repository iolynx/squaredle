import { generate } from "random-words";
// import wordsDictionary from './assets/words_dictionary.json'; //  not using this anymore
import wordsDictionary from './assets/dictionary.json';
import words3 from './assets/words3.js'
import words2 from './assets/words.json'

const commonwords = Object.keys(words2).reduce((acc, key) => {
  acc[key.toLowerCase()] = words2[key];
  return acc;
}, {});

const wordObj = words3.reduce((obj, word) => {
  obj[word] = 1;
  return obj;
}, {})

var answerList = []

var globalVisited = []

var globalStartingLetter = []

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const letterFrequency = {};
for (const letter of alphabet) {
  letterFrequency[letter] = 0;
}


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
  let board = []
  do {
    board = generateRandomBoardHelper(rows, cols, longWords)
    console.log('board obtained')
    answerList = findAllWords(board);
  } while (answerList.length < 12 && !globalVisited.includes(0))
  // if any bugs come its because of ^^^^^^^^^^^^^^^^^^^^^^^^^^^ this line (newest)

  return [board, answerList]
}

export function updateStartFrequencies(sf, selectedPath) {
  const sfCopy = sf.map(row => [...row]);
  sfCopy[selectedPath[0][0]][selectedPath[0][1]] -= 1;

  return sfCopy;
}

export function updateLetterFrequencies(cf, selectedPath) {
  console.log('selectedPath: ', selectedPath)
  console.log('cf before: ', cf)
  // for (let i = 0; i < selectedPath.length; ++i) {
  //   cf[selectedPath[i][0]][selectedPath[i][1]] -= 1;
  // }
  // console.log(cf)
  const cfCopy = cf.map(row => [...row]);
  for (let i = 0; i < selectedPath.length; ++i) {
    cfCopy[selectedPath[i][0]][selectedPath[i][1]] -= 1;
  }

  console.log('Updated cf:', cfCopy);
  return cfCopy;
}

export function getCellFrequencies() {
  return globalVisited;
}

export function getStartingLetterFrequencies() {
  return globalStartingLetter;
}

export function generateCodeBoard(code) {
  const length = Math.sqrt(code.length)
  const board = []
  let sub = 0
  for (let k = 0; k < length; ++k) {
    var row = []
    for (let i = 0; i < length; ++i) {
      row.push(code[sub].toUpperCase())
      sub++
    }
    board.push(row)
  }
  answerList = findAllWords(board);
  console.log(answerList)
  return board
}


function generateRandomBoardHelper(rows, cols, longWords) {
  const vowels = ["AEI", "AEIOU"];
  const consonants = ["TSRNLCKDWVBMH", "BCDFGHJKLMNPQRSTVW"];
  // const niceConsonants = "RSTHLWC";
  let v = vowels[0]
  let c = consonants[0];
  let board = []

  console.log(rows, cols)
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
          console.log("unable to cook");
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


function dfs(board, row, col, visited, curword, foundWords) {
  if (row < 0 || col < 0 || row >= board.length || col >= board.length || visited[row][col]) {
    return;
  }

  if (curword.length == 0) {
    visited[row][col] = 2;
  } else {
    visited[row][col] = 1;
  }

  curword += board[row][col];


  if (wordIsValid(curword.toLowerCase()) && curword.length > 3 && !foundWords.has(curword)) {
    foundWords.add(curword);
    addVisitedToGlobal(globalVisited, globalStartingLetter, visited)
  }

  let neighbours = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]
  for (let [dx, dy] of neighbours) {
    let newRow = row + dx;
    let newCol = col + dy;
    dfs(board, newRow, newCol, visited, curword, foundWords)
  }

  visited[row][col] = 0
  return
}

function findAllWords(board) {
  let visited = Array(board.length).fill(false).map(() => Array(board[0].length).fill(0));
  globalVisited = Array(board.length).fill(false).map(() => Array(board[0].length).fill(0));
  globalStartingLetter = Array(board.length).fill(false).map(() => Array(board[0].length).fill(0));
  const curword = ""
  let foundWords = new Set()
  for (let row = 0; row < board.length; ++row) {
    for (let col = 0; col < board.length; ++col) {
      dfs(board, row, col, visited, curword, foundWords)
    }
  }
  return Array.from(foundWords)
}

export const wordIsValid = (word) => {
  const wordlc = word.toLowerCase()
  if (wordObj[wordlc] !== undefined && wordlc in commonwords) {
    if (word.length > 3) {
      return true
    }
  }
  return false
}

function addVisitedToGlobal(globalVisited, globalStartingLetter, visited) {
  const rows = globalVisited.length;
  const cols = globalVisited[0].length;

  // Iterate through the rows and columns to add the number of repeating elements
  console.log("added to visited");
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // if visited == 2, its the starting
      if (visited[i][j] === 2) {
        globalVisited[i][j] += 1
        globalStartingLetter[i][j] += 1
      } else if (visited[i][j] == 1) {  // else its in the middle
        globalVisited[i][j] += 1
      }
      // globalVisited[i][j] += visited[i][j] ? 1 : 0;
    }
  }
  // return globalVisited
}
