import { memo, useEffect, useState } from "react"
import "./index.css"

const Board = memo(({gaps}) => {

    console.log(gaps)

    return (
        <>
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