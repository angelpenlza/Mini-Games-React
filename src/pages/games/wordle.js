import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Wordle() {
  const [words,setWords] = useState(new Set());
  const [wordPool, setWordPool] = useState(["ANGEL"]);
  const wordRef = useRef(words);
  
  useEffect(() => {
    fetch('/Mini-Games-React/words.txt')
      .then(res => res.text())
      .then(text => {
        console.log('reading words...');
        const wordSet = new Set(
          text.split('\n').map(word => word.trim().toUpperCase())
        );
        setWords(wordSet);
      })

    fetch('/Mini-Games-React/word_pool.txt')
      .then(res => res.text())
      .then(text => {
        console.log(text);
        const wordPoolArray = text.split('\n').map(word => word.trim().toUpperCase());
        setWordPool(wordPoolArray);
      })
  }, []);

  useEffect(() => {
    wordRef.current = new Set(words);
  }, [words]);
  
  const WORD = wordPool[Math.floor(Math.random() * wordPool.length)];
  const blockClass = Array.from({ length: 30 }, () => "block");
  const keyClass = Array.from({ length: 26 }, () => "key");
  const [blockClasses, setBlockClasses] = useState(blockClass);
  const [keyClasses, setKeyClasses] = useState(keyClass);
  const [userInput, setUserInput] = useState([ "", "", "", "", "", "" ]);
  const [row, setRow] = useState(0);
  const [message, setMessage] = useState("empty");
  const [messageStatus, setMessageStatus] = useState("invisible");
  const [active, setActive] = useState(true);

  const rowRef = useRef(row); 
  const userRef = useRef(userInput);
  
  const setColor = (color, pos) => {
    setBlockClasses(prev => {
      const result = [...prev];
      if(result[rowRef.current * 5 + pos] === "block")
        result[rowRef.current * 5 + pos] = color;
      return result;
    });
    setKeyClasses(prev => {
      const letterIndex = userRef.current[rowRef.current][pos];
      const newKeyClasses = [...prev];
      const currentLetter = newKeyClasses[keys.indexOf(letterIndex)];
      if(currentLetter === "key" || color === "correct")
        newKeyClasses[keys.indexOf(letterIndex)] = `k-${color}`;
      return newKeyClasses;
    });
  }

  const alertUser = (mes) => {
    setMessage(mes);
    setMessageStatus("alert");
    setTimeout(() => {
      setMessageStatus("invisible");
    }, 1000);
  }

  const getUserLetter = (curLet) => {
    if(curLet === "Enter") {
      if(userRef.current[rowRef.current].length === 5)
        checkWord();
      else {
        alertUser("Not enough letters");
      }
    } else if(curLet === "Backspace") { 
      setUserInput(prev => {
        const newInput = [...prev];
        newInput[rowRef.current] = prev[rowRef.current].slice(0, -1); 
        return newInput;
      });
    } else if(userRef.current[rowRef.current].length < 5 && /^[A-Za-z]$/.test(curLet)) {
      setUserInput(prev => { 
        const newInput = [...prev];
        newInput[rowRef.current] = prev[rowRef.current] + curLet.toUpperCase();
        return newInput; 
      });
    }
  }

  const getUserLetterFunc = (e) => {
    getUserLetter(e.key);
  }

  const checkWord = () => {
    const userWord = userRef.current[rowRef.current];
    let word = WORD;
    if(!wordRef.current.has(userWord)) {
      alertUser("Not in word list");
      return;
    }
    if(userWord === WORD) {
      switch(rowRef.current) {
        case 0:
          alertUser("Genius");
          break;
        case 1: 
          alertUser("Magnificent");
          break;
        case 2:
          alertUser("Impressive");
          break;
        case 3:
          alertUser("Splendid");
          break;
        case 4:
          alertUser("Great");
          break;
        case 5:
          alertUser("Phew");
          break;
      }
      window.removeEventListener('keydown', getUserLetterFunc);
      setActive(false);
    } 

    for(let i = 0; i < WORD.length; i++) { 
      console.log(word);
      if(userWord[i] === word[i]){
        setColor("correct", i);
        word = word.replace(word[i], " ");
      } else {
        for(let j = 0; j < userWord.length; j++) {
          if(userWord[i] === word[j]) {
            setColor("almost", i);
          word = word.replace(word[j], " ");
            break;
          }
        }
        setColor("wrong", i);
      }
    }
    if(rowRef.current < 5)
      setRow(prev => prev + 1);
  };

  useEffect(() => {
    rowRef.current = row; 
  }, [row]);

  useEffect(() => {
    userRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    window.addEventListener('keydown', getUserLetterFunc);
  }, []);

  const grid = Array.from({ length: 30 }, (_, index) => (
    <div key={index} className={blockClasses[index]}>
      {userInput[Math.floor(index / 5)][index % 5]}
    </div>
  ));

  const keyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const keys = keyRows.flat(1);

  const createKeyRow = (keyRow, rowOffest) => {
    return Array.from(keyRow, (letter, index) => (
    <div 
      onClick={ active ? () => { getUserLetter(letter) } : () => {} } 
      key={letter} 
      className={keyClasses[index + rowOffest]}>
        {letter}
    </div>
    ));
  } 

  const keysRowOne = createKeyRow(keyRows[0], 0);
  const keysRowTwo = createKeyRow(keyRows[1], 10);
  const keysRowThree = createKeyRow(keyRows[2], 19);

  return (
    <>
      <div className='top-bar'>
      <Link className='back' href='../'>Back</Link>
        <h1 className='game-header'>Wordle</h1>
        <div className='placeholder'></div>
      </div>
      <div className={messageStatus}>{message}</div>
      <div className='grid'>{grid}</div>
      <div className='keyboard'>
        <div className='keys-row-one'>{keysRowOne}</div>
        <div className='keys-row-two'>{keysRowTwo}</div>
        <div className='keys-row-three'>
          <div onClick={active ? 
            () => {getUserLetter("Enter")} :
            () => {}} className='special-key'>Enter</div>
          {keysRowThree}
          <div onClick={() => {getUserLetter("Backspace")}} className='special-key'>Del</div>
        </div>
      </div>
    </>
  );
};
