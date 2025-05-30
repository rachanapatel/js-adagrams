const letterCounts = [["A", 9], ["B", 2], ["C", 2], ["D", 4], ["E", 12], ["F", 2], 
                      ["G", 3], ["H", 2], ["I", 9], ["J", 1], ["K", 1], ["L", 4], 
                      ["M", 2], ["N", 6], ["O", 8], ["P", 2], ["Q", 1], ["R", 6], 
                      ["S", 4], ["T", 6], ["U", 4], ["V", 2], ["W", 2], ["X", 1], 
                      ["Y", 2], ["Z", 1]];

const scoreChart = {'A': 1,'E': 1, 'I': 1,'O': 1,'U': 1,'L': 1,'N': 1,'R': 1,'S': 1,'T': 1, 
                      'D': 2,'G': 2, 
                      'B': 3,'C': 3,'M': 3,'P': 3, 
                      'F': 4,'H': 4,'V': 4,'W': 4,'Y': 4, 
                      'K': 5, 
                      'J': 8,'X': 8, 
                      'Q': 10,'Z': 10
                    }

export const drawLetters = () => {
  const generatedHandDist = {};
  const generatedHand = [];
  const handSize = 10;
  let randLetterArr;
  let indexVal;

  while (generatedHand.length !== handSize) {
    indexVal = getRandomInt(0, letterCounts.length);
    randLetterArr = letterCounts[indexVal];
    if (!(randLetterArr[0] in generatedHandDist)) {
      generatedHandDist[randLetterArr[0]] = 1;
      generatedHand.push(randLetterArr[0]);
    } else {
      if (randLetterArr[1] < generatedHandDist[randLetterArr[0]]) {
        generatedHandDist[randLetterArr[0]]++;
        generatedHand.push(randLetterArr[0]);
      }
    }
  }
  return generatedHand;
};

//explained in Math.random() documentation
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); 
  // The maximum is exclusive and the minimum is inclusive
}


export const usesAvailableLetters = (input, lettersInHand) => {
  const lettersList = input.split("");
  const lettersInHandDict = createLetterFreqDict(lettersInHand);
  const inputDict = createLetterFreqDict(lettersList);

  for (const key in inputDict) {
    if (!(key in lettersInHandDict) || (lettersInHandDict[key] < inputDict[key])) {
      return false;
    }
  }
  return true;
};


function createLetterFreqDict(lettersInHand) {
  const letterCount = {};
  for (const char of lettersInHand) {
    if (char in letterCount) {
      letterCount[char]++;
    } else {
      letterCount[char] = 1;
    }
  }
  return letterCount
};

export const scoreWord = (word) => {
  let score = 0;
  const minBonusLength = 7;
  const lengthBonusPoints = 8;

  if (word.length >= minBonusLength) {
    score += lengthBonusPoints;
  }

  for (const char of word) {
    score += scoreChart[char.toUpperCase()];
  }
  return score;
};

export const highestScoreFrom = (words) => {
  let scoreList = [];
  for (const word of words) {
    scoreList.push([word, scoreWord(word)])
  }
  let winningScore = -1;
  let winningWord = "";
  let ties = [];

  for (const wordSet of scoreList) {
    if (wordSet[1] > winningScore) {
      winningScore = wordSet[1];
      winningWord =  wordSet[0];
      if (ties.length > 0) {
        ties = [];
      }
    }
    else if (wordSet[1] === winningScore)  {
      ties.push([winningWord, winningScore]);
      ties.push(wordSet);
    }
  }
  if (ties.length > 0) {
    const tieWinner = tiebreaker(ties);
    return {word: tieWinner[0], score: tieWinner[1]};
  }
  return {word: winningWord, score: winningScore};
};

function tiebreaker(tiesList) {
  let winningWordSet = tiesList[0];
  for (const wordSet of tiesList) {
    if (wordSet[0].length === 10) {
      return wordSet;
    } else {
      if (wordSet[0].length < winningWordSet[0].length) {
        winningWordSet = wordSet;
      }
    }
  }
  return winningWordSet;
};
