import { useCallback, useEffect, useState } from "react";
import HangmanDrawing from "./components/HangmanDrawing";
import HangmanWord from "./components/HangmanWord";
import Keyboard from "./components/Keyboard";
import words from "./wordsList.json";
import "./App.css";

function App() {
  const [word, setWord] = useState<string>(
    () => words[Math.floor(Math.random() * words.length)]
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const incorrectGuesses = guessedLetters.filter(
    (letter) => !word.includes(letter)
  );
  const isGameOver = incorrectGuesses.length >= 6;
  const isGameWon = word
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isGameOver || isGameWon) return;
      setGuessedLetters((prev) => [...prev, letter]);
    },
    [guessedLetters, isGameOver, isGameWon]
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (!key.match(/^[a-z]$/)) return;
      e.preventDefault();
      addGuessedLetter(key);
    };
    document.addEventListener("keypress", handler);
    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessedLetters]);
  return (
    <div className="App">
      <div
        style={{
          maxWidth: "800px",
          minWidth: "60%",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          margin: "0, auto",
          alignItems: "center",
        }}
      >
        <div className="title">Hangman</div>
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          {isGameWon && "Winner!"} {isGameOver && "Nice Try - Try Again"}
        </div>
        <HangmanDrawing numIncorrectGuesses={incorrectGuesses.length} />
        <HangmanWord
          guessedLetters={guessedLetters}
          word={word}
          reveal={isGameOver}
        />
        <div style={{ alignSelf: "stretch" }}>
          <Keyboard
            disabled={isGameOver || isGameWon}
            activeLetters={guessedLetters.filter((letter) =>
              word.includes(letter)
            )}
            inactiveLetters={incorrectGuesses}
            addGuessedLetter={addGuessedLetter}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
