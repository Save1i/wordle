import { useEffect, useState } from 'react';
import './App.css';
import { dataW } from './data/mockData';
import Board from './Board';
import { useRef } from 'react';
import EndOfGame from './EndOfGame';

function App() {
  const [word, setWord] = useState(null);
  const finallWord = useRef([])
  const [currentWord, setCurrentWord] = useState([]);    // Текущее слово (массив букв)

  const [win, setWin] = useState(null)

  // Сделать массивом объектов
  const [gaps, setgaps] = useState(Array(30).fill().map(() => ({letter: "", status: "default"}))); // Все ячейки (6 рядов × 5 колонок)

  const [currentCellIndex, setCurrentCellIndex] = useState(0); // Текущая активная ячейка
  const startCellIndex = useRef(0)

  // Загрузка данных и выбор случайного слова (1 раз при монтировании)
  useEffect(() => {
    dataW.then((response) => {
      const words = response.words;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      setWord(randomWord);
    });
  }, []);

const check = (guessedWordArr) => {
  const targetWordArr = word.split('');
  const result = [];

  // Создаём копии массивов, чтобы не мутировать оригиналы
  const remainingTargetLetters = [...targetWordArr];
  const remainingGuessedLetters = [...guessedWordArr];

  // Сначала проверяем точные совпадения (буква на своём месте)
  for (let i = 0; i < guessedWordArr.length; i++) {
    if (guessedWordArr[i] === targetWordArr[i]) {
      result[i] = { letter: guessedWordArr[i], status: 'correct' }; // правильная позиция
      remainingTargetLetters[i] = null; // Помечаем букву как использованную
      remainingGuessedLetters[i] = null;
    }
  }

  // Затем проверяем буквы, которые есть в слове, но не на своём месте
  for (let i = 0; i < remainingGuessedLetters.length; i++) {
    if (remainingGuessedLetters[i] === null) continue; // Уже обработанные буквы пропускаем

    const foundIndex = remainingTargetLetters.indexOf(guessedWordArr[i]);
    if (foundIndex !== -1) {
      result[i] = { letter: guessedWordArr[i], status: 'present' }; // есть в слове, но не здесь
      remainingTargetLetters[foundIndex] = null; // Помечаем букву как использованную
    } else {
      result[i] = { letter: guessedWordArr[i], status: 'absent' }; // нет в слове
    }
  }
  return result;
};

const checkWin = (wordResult) => {
  if (!wordResult) return false;
  return wordResult.every(letter => letter.status === "correct");
};

  // Обработка нажатия клавиш
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      // Backspace - удаляем последнюю букву
      if (key === 'Backspace') {
        setCurrentWord((prev) => {
          if (prev.length === 0) return prev;
          const newWord = prev.slice(0, -1);
          const newgaps = [...gaps];
          newgaps[currentCellIndex - 1] = {letter: "", status: "default"}; // Очищаем предыдущую ячейку
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
          
          // Обновляем ячейки
          const newgaps = [...gaps];
          console.log(newgaps)
          newgaps[currentCellIndex].letter = key;
          setgaps(newgaps);
          setCurrentCellIndex((prev) => prev + 1);

          // Если слово из 5 букв завершено
          if (newWord.length === 5) {
            console.log(newWord)
            console.log(currentCellIndex)

            console.log('Слово:', newWord.join(''));
            finallWord.current = (check(newWord))

            const newgaps = [...gaps];
            const wordLetters = finallWord.current
            // console.log(startCellIndex, currentCellIndex)
            newgaps.splice(startCellIndex.current, 5, ...wordLetters)
            setgaps(newgaps)

            console.log(finallWord.current)
                        if (checkWin(finallWord.current)) {
              setWin(true);
            } 
            else if (startCellIndex.current === 25) { // 5 попыток × 5 букв = 25
              setWin(false);
            }

            startCellIndex.current += 5
            return []; // Сбрасываем текущее слово
          }
          return newWord;
        });
      }
    };

    if(win) {
      window.removeEventListener('keydown', handleKeyPress);
      return
    }

    if(currentCellIndex === 30) {
      window.removeEventListener('keydown', handleKeyPress);
      return
    }

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gaps, currentCellIndex]); // Зависимости для актуальных значений

  return (
    <>
      <p>Загаданное слово: {word}</p>
      <Board gaps={gaps} />
      <EndOfGame win={win}/>
    </>
  );
}

export default App;