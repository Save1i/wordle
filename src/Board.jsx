import { memo, useRef, useState, useEffect } from "react"
import "./index.css"

const Board = memo(({ gaps }) => {
  const inputRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Определяем, является ли устройство мобильным
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobileDevice(isMobile && hasTouch);
    };

    checkMobile();
    
    // Также проверяем при изменении размера окна (на случай ориентации)
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleActivate = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => setShowOverlay(false), 50);
    }
  };

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
          width: 0
        }}
        onFocus={() => setShowOverlay(false)}
        onBlur={() => {
          if (isMobileDevice) {
            setShowOverlay(true);
          }
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            fontSize: '18px',
            textAlign: 'center'
          }}
          onTouchStart={handleActivate}
          onClick={handleActivate}
        >
          <div style={{ 
            padding: '40px', 
            border: '2px dashed #fff',
            color: '#fff',
            borderRadius: '15px',
            background: 'rgba(0, 0, 0, 0.5)'
          }}>
            👆 Tap anywhere to start typing
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