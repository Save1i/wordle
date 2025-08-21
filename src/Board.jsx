import { memo, useEffect, useRef, useState } from "react"
import "./index.css"

const Board = memo(({gaps}) => {
  const inputRef = useRef(null);

  const [focus, setFocus] = useState(false)
  const focusRef = useRef(false)

  const handleTouchStart = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setFocus(true)
    }

  };
    console.log(gaps)
    console.log(focusRef.current)

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
        />
        {
            focus ? <p style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            height: 0,
            width: 0
            }}></p> : <div 
            style={{ 
            position: 'absolute',
            zIndex: 100,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '50px', 
            border: '2px dashed #666',
            fontSize: '18px',
            textAlign: 'center'
            }}
            onTouchStart={handleTouchStart}
            onClick={() => inputRef.current?.focus()}
        >
            👆 tap on screen
        </div>
        }
        
        <div className="board">
            <ul className="board__gaps">
            {
                gaps.map((el, index) => (
                    <li key={index} className={el.status + " gap"}>{el.letter}</li>
                ))
            }
            </ul>
        </div>
        </>
    )
})

export default Board