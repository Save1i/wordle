import { memo, useRef, useState, useEffect, useCallback } from "react"
import "./index.css"

const Board = memo(({ gaps, restart, onKeyPress }) => {
  const inputRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const previousValue = useRef('');

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobileDevice((isMobile || hasTouch) && isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.value = '';
      previousValue.current = '';
    }
  }, [restart]);

  // Обработка ввода с мобильной клавиатуры
  const handleInput = (e) => {
    const currentValue = e.target.value;
    
    // Фильтруем только английские буквы a-z
    const filteredValue = currentValue.replace(/[^a-z]/g, '');
    
    if (filteredValue !== currentValue) {
      e.target.value = filteredValue;
      return;
    }
    
    // Определяем новые символы
    if (filteredValue.length > previousValue.current.length) {
      const newChars = filteredValue.slice(previousValue.current.length);
      
      // Отправляем каждый новый символ
      for (let char of newChars) {
        if (/^[a-z]$/.test(char)) {
          onKeyPress(char);
        }
      }
    } 
    // Определяем backspace (удаление)
    else if (filteredValue.length < previousValue.current.length) {
      onKeyPress('Backspace');
    }
    
    previousValue.current = filteredValue;
  };

  // Скрыть overlay при фокусе
  useEffect(() => {
    const handleFocus = () => {
      setShowOverlay(false);
    };

    const handleBlur = () => {
      if (isMobileDevice) {
        setTimeout(() => setShowOverlay(true), 200);
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      input.addEventListener('input', handleInput);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
        input.removeEventListener('input', handleInput);
      }
    };
  }, [isMobileDevice, onKeyPress]);

  const shouldShowOverlay = isMobileDevice;

  return (
    <>
      <div className="board">
        {shouldShowOverlay && (
          <div style={{opacity: showOverlay ? 1 : 0, transition: 'opacity 0.3s ease-in-out'}}>
            <p className="phone__text">Tap on the screen👆</p>
            <input 
              ref={inputRef} 
              type="text"
              className="phone__input" 
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        )}
        <ul className="board__gaps">
          {gaps.map((el, index) => (
            <li key={index} className={el.status + " gap"}>{el.letter}</li>
          ))}
        </ul>
      </div>
    </>
  )
})

export default Board