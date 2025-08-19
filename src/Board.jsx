import { memo, useEffect, useState } from "react"
import "./index.css"

const Board = memo(({finalWord, gaps}) => {

    console.log(gaps)
    console.log(finalWord)

    return (
        <>
        <ul className="board__gaps">
        {
            gaps.map((el, index) => (
                <li key={index} className="gap">{el}</li>
            ))
        }
        </ul>
        </>
    )
})

export default Board