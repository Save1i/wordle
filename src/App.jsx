import { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';
import { dataW } from './data/mockData';
import Board from './Board';
import EndOfGame from './EndOfGame';

function App() {
  const [word, setWord] = useState(null);
  const finallWord = useRef([])
  const [currentWord, setCurrentWord] = useState([]);
  const [resultOfGame, setresultOfGame] = useState(false)
  const [startGame, setStartGame] = useState(true)
  const [resetGame, setRestGame] = useState(false)
  const [gaps, setgaps] = useState(Array(30).fill().map(() => ({letter: "", status: "default"})));
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const startCellIndex = useRef(0)

  // Загрузка данных и выбор случайного слова
  useEffect(() => {
    dataW.then((response) => {
      setgaps(Array(30).fill().map(() => ({letter: "", status: "default"})));
      setCurrentCellIndex(0);
      startCellIndex.current = 0;
      const words = response.words;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord);
    });
  }, [resetGame]);

  // проверка введенного слова
  const check = (guessedWordArr) => {
    if (!word) return [];
    
    const targetWordArr = word.split('');
    const result = [];

    const remainingTargetLetters = [...targetWordArr];
    const remainingGuessedLetters = [...guessedWordArr];

    for (let i = 0; i < guessedWordArr.length; i++) {
      if (guessedWordArr[i] === targetWordArr[i]) {
        result[i] = { letter: guessedWordArr[i], status: 'correct' };
        remainingTargetLetters[i] = null;
        remainingGuessedLetters[i] = null;
      }
    }

    for (let i = 0; i < remainingGuessedLetters.length; i++) {
      if (remainingGuessedLetters[i] === null) continue;

      const foundIndex = remainingTargetLetters.indexOf(guessedWordArr[i]);
      if (foundIndex !== -1) {
        result[i] = { letter: guessedWordArr[i], status: 'present' };
        remainingTargetLetters[foundIndex] = null;
      } else {
        result[i] = { letter: guessedWordArr[i], status: 'absent' };
      }
    }
    return result;
  };

  const checkWin = (wordResult) => {
    if (!wordResult) return false;
    return wordResult.every(letter => letter.status === "correct");
  };

  // Обработчик нажатия клавиш (универсальный для ПК и мобильных)
  const handleKeyPress = useCallback((key) => {
    if (!startGame) return;

    // Backspace - удаляем последнюю букву
    if (key === 'Backspace') {
      setCurrentWord((prev) => {
        if (prev.length === 0) return prev;
        const newWord = prev.slice(0, -1);
        const newgaps = [...gaps];
        newgaps[currentCellIndex - 1] = {letter: "", status: "default"};
        setgaps(newgaps);
        setCurrentCellIndex((prev) => prev - 1);
        return newWord;
      });
      return;
    }

    // Буква a-z - добавляем в текущее слово
    if (/^[a-z]$/.test(key)) {
      setCurrentWord((prev) => {
        const newWord = [...prev, key];
        
        const newgaps = [...gaps];
        newgaps[currentCellIndex].letter = key;
        setgaps(newgaps);
        setCurrentCellIndex((prev) => prev + 1);

        // Если слово из 5 букв завершено
        if (newWord.length === 5) {
          finallWord.current = check(newWord);
          const newgaps = [...gaps];
          const wordLetters = finallWord.current;
          newgaps.splice(startCellIndex.current, 5, ...wordLetters);
          setgaps(newgaps);

          if (checkWin(finallWord.current)) {
            setStartGame(false);
            setresultOfGame(true);
          } else if (startCellIndex.current === 25) {
            setStartGame(false);
            setresultOfGame(false);
          }

          startCellIndex.current += 5;
          return [];
        }
        return newWord;
      });
    }
  }, [gaps, currentCellIndex, startGame, check, checkWin]);

  // Обработка клавиш ПК
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!startGame) return;
      
      const key = event.key;
      
      // Игнорируем специальные сочетания клавиш
      if (event.ctrlKey || event.altKey || event.metaKey) return;
      
      if (key === 'Backspace' || /^[a-z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, startGame]);

  const reset = (e) => {
    setStartGame(e);
    setRestGame((prev) => !prev);
  }

  return (
    <>
      <Board 
        gaps={gaps} 
        restart={resetGame}
        onKeyPress={handleKeyPress}
      />
      <EndOfGame 
        result={resultOfGame} 
        startGame={startGame} 
        restart={reset} 
        word={word}
      />
    </>
  );
}

export default App;