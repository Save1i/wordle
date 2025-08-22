import { memo, useRef, useState, useEffect, useCallback } from "react"
import "./index.css"

const Board = memo(({ gaps, restart }) => {
  const inputRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

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
      inputRef.current.value = ''
      console.log(inputRef.current.value)
    }

  }, [restart])

  // Скрыть overlay при фокусе
  useEffect(() => {
    const handleFocus = () => {
      setShowOverlay(false);
    };

    const handleBlur = (e) => {
      // Не показываем overlay если это было программное сворачивание клавиатуры
      // или если мы в процессе фокусировки
      if (isMobileDevice) {
        setTimeout(() => setShowOverlay(true), 200);
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [isMobileDevice]);

  // overlay только на мобильных устройствах
  const shouldShowOverlay = isMobileDevice;

  console.log(showOverlay + " show")

  return (
    <>
      <div className="board">
        {shouldShowOverlay && (
          <div style={{opacity: showOverlay ? 1 : 0, transition: 'opacity 0.3s ease-in-out'}} >
            <p className="phone__text" >Tap on the screen👆</p>
            <input 
              ref={inputRef} 
              type="text"
              className="phone__input" 
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