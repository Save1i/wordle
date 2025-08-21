const EndOfGame = ( {result, startGame, restart, word} ) => {
    console.log(startGame)

    const resultOfGame = (result, startGame) => {
        if(!startGame) {
            return (result ? 
                <div className="result">
                    <p className="result__text">Congrats!</p>
                    <button onClick={() => restart(true)}>restart</button>
                </div> : 
                <div className="result">
                    <div>
                        <p className="result__text">Bad luck!</p>
                        <p className="result__text">This word: {word}</p>
                    </div>
                <button onClick={() => restart(true)}>restart</button>
                </div>)
            }
        return null
    }

    return (
        <>
            {resultOfGame(result, startGame)}
        </>
    );
}

export default EndOfGame;