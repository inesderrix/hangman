import { useState, useEffect } from "react";

type DifficultyLevel = "facile" | "moyen" | "difficile";
type Category = "animaux" | "aliments" | "pays" | "aléatoire";

const categories = {
  animaux: "/public/assets/animaux.json",
  aliments: "/public/assets/aliments.json",
  pays: "/public/assets/pays.json",
  aléatoire:"/public/assets/tous.json",
};

const livesByDifficulty = {
  facile: 6,
  moyen: 4,
  difficile: 2,
};


function App() {

  

  const [difficulty, setDifficulty] = useState<DifficultyLevel | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [word, setWord] = useState<string>("");
  const [letters, setLetters] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(6);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");



  useEffect(() => {
    if (category && difficulty) {
    fetch(categories[category])
      .then((response) => response.json()) 
      .then((data) => {
        const randomWord = data[Math.floor(Math.random() * data.length)];
        setWord(randomWord);
        setLetters([]);
        setLives(livesByDifficulty[difficulty]);
        setGameOver(false);
        setMessage("");

      })
    }
  }, [category,difficulty]);

  const displayWord = () =>{
    return word
      .split("")
      .map((letter) =>{
        if ("-".includes(letter)){
          return letter;
        }
        return letters.includes(letter)?letter:"_";
      })
      .join(" ");
  };


  const handleLetterClick = (letter : string) => {
    if (!letters.includes(letter)){
      setLetters([...letters,letter]);
    }
    if(!word.includes(letter)){
      setLives(lives-1);
    }

  }

  const alphabet="abcdefghijklmnopqrstuvwxyzéèê".split("");

  useEffect(() => {
    if (word) {
      const isWin = word.split("").every((letter) => letters.includes(letter) || "-".includes(letter));
      if (isWin) {
        setMessage("🎉 Bravo, vous avez gagné !");
        setGameOver(true);
      } else if (lives <= 0) {
        setMessage(`😞 Désolé, vous avez perdu... Le mot était : ${word}`);
        setGameOver(true);
      }
    }
  }, [letters, lives, word]);

  const restartGame = () => {
    setCategory(""); 
    setWord("");
    setLetters([]);
    setLives(6);
    setGameOver(false);
    setMessage("");
    setDifficulty("");
  };

  return (
    <div className="jeu">
      <h1>Jeu du Pendu</h1>
      {!difficulty && !gameOver && (
        <div>
          <h2>Choisissez un niveau de difficulté :</h2>
          <div className="button-container">

          {(Object.keys(livesByDifficulty) as DifficultyLevel[]).map((level) => (
            <button key={level} onClick={() => setDifficulty(level)}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
          </div>
        </div>
      )}

    
      {difficulty && !category && !gameOver && (
        <div>
          <h2>Choisissez une catégorie :</h2>
          <div className="button-container">
          {(Object.keys(categories) as Category[]).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}>
              {cat}
            </button>
          ))}
          </div>
        </div>
      )}

      {category && !gameOver &&(
        <div>
          <p>Mot : {word}</p>
          <p>Mot à deviner : {displayWord()}</p>
          <p>Vies restantes : <span className="vie">{lives}</span> </p>

          <div className="button-container">
            {alphabet.map((letter) => (
              <button key={letter} onClick={() => handleLetterClick(letter)} disabled={letters.includes(letter)}>
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}
      {gameOver &&(
        <div>
          <h2>{message}</h2>
          <button onClick={restartGame}> Recommencer</button>
        </div>
      )}
    </div>
  );
}

export default App;
