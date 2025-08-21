import { memo, useRef, useState, useEffect, useCallback } from "react"
import "./index.css"

const Board = memo(({ gaps }) => {
  const inputRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const isFocusingRef = useRef(false);

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

  const handleActivate = useCallback(() => {
    if (inputRef.current) {
      isFocusingRef.current = true;
      inputRef.current.focus();
      
      // Не скрываем overlay сразу, даем время на фокус
      setTimeout(() => {
        setShowOverlay(false);
        isFocusingRef.current = false;
      }, 100);
    }
  }, []);

  // Скрываем overlay при успешном фокусе
  useEffect(() => {
    const handleFocus = () => {
      setShowOverlay(false);
    };

    const handleBlur = (e) => {
      // Не показываем overlay если это было программное сворачивание клавиатуры
      // или если мы в процессе фокусировки
      if (!isFocusingRef.current && isMobileDevice) {
        // Небольшая задержка чтобы избежать мигания
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

  // Показываем overlay только на мобильных устройствах
  const shouldShowOverlay = showOverlay && isMobileDevice;

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          height: 0,
          width: 0,
          top: 0,
          left: 0
        }}
      />
      
      {shouldShowOverlay && (
        <div 
          style={{ 
            position: 'fixed',
            zIndex: 100,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            fontSize: '18px',
            textAlign: 'center',
            touchAction: 'none' // Предотвращаем скролл
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            handleActivate();
          }}
          onClick={handleActivate}
        >
          <div style={{ 
            padding: '30px', 
            border: '2px dashed #fff',
            color: '#fff',
            borderRadius: '15px',
            background: 'rgba(0, 0, 0, 0.7)',
            maxWidth: '80%'
          }}>
            👆 Tap to start typing
          </div>
        </div>
      )}
      
      <div className="board">
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