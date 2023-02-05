import { useEffect, useState } from 'react';
import Link from 'next/link';
import WinModal from './winModal.js';
import styles from './index.module.css'

const LINE_LENGTH = 5;

export default function Wordle() {
  const [targetWord, setTargetWord] = useState("");
  const [allInputs, setAllInputs] = useState(Array(6).fill(null));
  const [currentInput, setCurrentInput] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // corner 1
      if (isGameOver) return;

      if (event.key === "Enter") {
        if (currentInput.length < 5) return;

        const isCorrect = currentInput === targetWord;
        setIsGameOver(isCorrect);
        if (isGameOver) return;

        const oldAllInputs = [...allInputs];
        oldAllInputs[allInputs.findIndex((val) => val === null)] = currentInput;

        setAllInputs(oldAllInputs);
        //不要忘了reset current
        setCurrentInput("");
      }
      // corner 2 后面如果没有return, 就会继续跑corner 3
      // if 条件可以不考虑&& currentInput.length >= 0，因为使用slice() 不要求 str.length > 0
      if (event.key === "Backspace") {
        // slice 用于删除最后一个，-1 比 n-1 更好
        // setCurrentInput(currentInput.slice(0, currentInput.length - 1));
        setCurrentInput(currentInput.slice(0, -1));
        return;
      }
      // corner 3
      if (currentInput.length >= 5) return;
      // normal
      setCurrentInput(currentInput + event.key);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // 为什么需要监听targetword, 因为出现在useeffect 里面的dependency 都要放
  }, [currentInput, allInputs, isGameOver, targetWord]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await fetch(API);
        // const jsonData = await res.json();
        setTargetWord("hello");
      } catch (err) {
        console.log("error is ", err);
      }
    };

    fetchData();
  }, []);

  const handleClickReset = () => {
    setAllInputs(new Array(6).fill(null));
    setCurrentInput("");
    setIsGameOver(false);
  };

  const handleClickShowAnswer = () => {
    setShowAnswer(true);
  }

  return (
    <div className={styles.main}>
      <h2>
        <Link href="/">Back to home</Link>
      </h2>

      {
        showAnswer?
        <h1>{targetWord}</h1>
        :
        null
      }
      <button className={styles.btn} onClick={handleClickShowAnswer}>Show Answer</button>
      <button className={styles.btn} onClick={handleClickReset}>reset</button>

      <div>
        {allInputs &&
          allInputs.map((input, index) => {
            // index === allinputs 1st null
            const isCurrent =
              index === allInputs.findIndex((val) => val === null);
            return (
              <Line
                key={index}
                input={isCurrent ? currentInput : input ? input : ""}
                IsSubmitted={!isCurrent && input !== null}
                randomWord={targetWord}
              />
            );
          })}
      </div>

      {
        isGameOver?
        <WinModal handleClickReset={handleClickReset} answer={targetWord}/>
        :
        <></>
      }
    </div>
  );
}

function Line({ input, IsSubmitted, randomWord }) {
  const cubes = [];

  for (let i = 0; i < LINE_LENGTH; i++) {
    const char = input[i];
    let className = styles.cube;
    // change color
    if (IsSubmitted) {
      if (char === randomWord[i]) {
        className = `${styles.correct} ${styles.cube}`;
      } else if (randomWord.includes(char)) {
        className = `${styles.close} ${styles.cube}`;
      } else {
        className = `${styles.wrong} ${styles.cube}`;
      }
    }
    cubes.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className={styles.line}>{cubes}</div>;
}




