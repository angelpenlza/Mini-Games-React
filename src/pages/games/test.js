import { useState, useEffect, useRef } from "react";

export default function Test() {
  const [word, setWord] = useState("angel");
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState(false);

  const wordRef = useRef(word);

  const showWord = (e) => {
    if(e.key === "Backspace")
      setUserInput(prev => prev.slice(0, -1));
    else
    setUserInput(prev => prev + e.key);
  }

  useEffect(() => {
    wordRef.current = word;
  }, [word]);

  useEffect(() => {
    window.addEventListener('keydown', showWord);
  }, []);

  const checkWord = () => {
    for(let i = 0; i < word.length; i++) {
      console.log(wordRef);
      setWord(word[i]);
    }
  }

  return (
    <>
    <div>word: {word}</div>
    <div>your word: {userInput}</div>
    <div onClick={checkWord}>enter</div>
    <div>{ status ? <div>equal</div> : <div> not equal</div>}</div>
    </>
  );
};