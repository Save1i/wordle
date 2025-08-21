const EndOfGame = ( {win} ) => {
    console.log(win)
  if (win === null) {
    return null;
  }

  return (
    <>
    <div className="result">
      {win ? <p className="result__text">Congrats!</p> : <p className="result__text">Bad luck!</p>}
    </div>
    </>
  );
}

export default EndOfGame;