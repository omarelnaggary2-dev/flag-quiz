import { useState, useEffect } from "react";
function getRandomCountry(data) {
  //UNUSED
  const entries = Object.entries(data);
  const randomIndex = Math.floor(Math.random() * entries.length);
  const [code, name] = entries[randomIndex];

  return { code, name };
}

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

async function fetchCountryData() {
  //async enables await

  //REQUEST DATA - fetch sends request to server - it returns a promise - await tells it to wait for a result
  const response = await fetch("https://flagcdn.com/en/codes.json");

  //EXTRACT ACTUAL DATA -
  const data = await response.json();

  //TRANSFORM DATA FORMAT - dictionary to array
  const countries = Object.entries(data).map(([code, name]) => {
    return { code, name };
  });

  return countries;
}

async function createLevel(data, len) {
  const entries = Object.entries(data); //CONVERT
  const shuffledEntries = shuffle(entries);

  //CREATE QUESTIONS
  const questions = shuffledEntries
    .slice(0, len)
    .map(([correctCode, correctName], index) => {
      let flag = correctName.code;

      //TAKE 3 DISTRACTORS (NEXT 3 ELEMENTS IN ARRAY)
      const distractors = shuffledEntries.slice(len + index, len + index + 3);

      // console.log(distractors)

      //COMBINE CORRECT + DISTRACTORS
      const rawOptions = [[correctCode, correctName], ...distractors];

      //BUILD OPTIONS ARRAY * len

      const options = rawOptions.map(([code, name]) => ({
        countryName: name,
        countryCode: code,
        isCorrect: code === correctCode,
      }));

      //SHUFFLE THE 4 OPTIONS
      const shuffledOptions = shuffle(options);

      //RETURN IMAGE LINK + LEVEL OPTIONS DATA
      return {
        imageLink: `https://flagcdn.com/w160/${flag}.png`,
        options: shuffledOptions,
      };
    });
  return questions;
}

export default function App() {
  //STATES & VARIABLES
  const [countries, setCountries] = useState([]);
  const [level, setLevel] = useState({});
  const [gameLength, setGameLength] = useState(7);

  const [selected, setSelected] = useState(null);

  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOn, setGameOn] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  //FUNCTIONS

  //LOADING DATA \/
  useEffect(() => {
    async function loadData() {
      const data = await fetchCountryData();
      setCountries(data);
    }

    loadData();
  }, []);

  //INITIALIZE QUIZ
  useEffect(() => {
    async function initQuiz() {
      const lvl = await createLevel(countries, gameLength);
      setLevel(lvl);
    }

    initQuiz();
  }, [countries]);

  function nextStage() {
    calculateScore();
    setSelected(null);
    if (stage === 0 && !gameOn) handleStartGame();
    if (stage >= gameLength) handleLastStage();
    else setStage((stage) => stage + 1);
  }

  function calculateScore() {
    // console.log(level[stage - 1]?.options[selected]?.isCorrect);
    if (level[stage - 1]?.options[selected]?.isCorrect) {
      increaseScore();
      setIsCorrect(true);
    } else setIsCorrect(false);
  }

  function increaseScore() {
    setScore(score + 1);
  }
  function prevStage() {
    if (stage <= 1) return;
    setStage((stage) => stage - 1);
  }

  function handleStartGame() {
    alert("Started game");
    setGameOn(true);
  }
  function handleLastStage() {
    alert("Game completed");
    setGameOn(false);
    setGamePlayed(true);
  }

  return (
    <div className="App">
      <h1>
        FLAG QUIZ stage: {stage}/{gameLength} {gameOn ? "Game On" : "Game Off"}
      </h1>
      <h3>Score: {score}</h3>
      <button className="stage-navigation" onClick={() => prevStage()}>
        {"<"}
      </button>
      {gameOn || (
        <button className="stage-navigation" onClick={() => nextStage()}>
          Start Game
        </button>
      )}
      {gameOn && (
        <Quiz
          level={level}
          stage={stage}
          gameLength={gameLength}
          nextStage={nextStage}
          selected={selected}
          setSelected={setSelected}
          score={score}
          increaseScore={increaseScore}
          isCorrect={isCorrect}
        />
      )}
    </div>
  );
}

function Quiz({
  level,
  stage,
  gameLength,
  nextStage,
  selected,
  setSelected,
  score,
  increaseScore,
  isCorrect,
}) {
  //STATES
  //VARIABLES
  //FUNCTIONS

  return (
    stage > gameLength || (
      <div>
        <Flag image={level[stage - 1].imageLink} />
        <Answers
          options={level[stage - 1].options}
          selected={selected}
          setSelected={setSelected}
        />
        <button onClick={nextStage}>GO</button>

        <ProgressBar
          gameLength={gameLength}
          selected={selected}
          level={level}
          stage={stage}
          score={score}
          isCorrect={isCorrect}
        />
      </div>
    )
  );
}
function Flag({ image }) {
  return (
    <div>
      <img
        src={image}
        // srcSet={`https://flagcdn.com/w320/${x}.png 2x`}
        width="160"
        alt={"Egypt"}
      ></img>
    </div>
  );
}
function Answers({ options, selected, setSelected }) {
  // console.log(selected);
  // console.log(options);
  function handleSelect(choice) {
    if (!selected) setSelected(choice);
    else setSelected(null);
  }

  // console.log(selected);

  return (
    <div>
      {options.map((opt, index) => (
        <Option
          key={opt.countryCode}
          selected={selected}
          onSelect={() => handleSelect(index)}
          index={index}
        >
          {opt.countryName.name}
        </Option>
      ))}
    </div>
  );
}
function Option({ children, selected, onSelect, index }) {
  return (
    <button
      onClick={() => onSelect(index)}
      style={
        selected === index
          ? { backgroundColor: "gray", color: "white" }
          : undefined
      }
    >
      {children}
    </button>
  );
}
function ProgressBar({ gameLength, level, stage, selected, score, isCorrect }) {
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: gameLength }, (_, i) => i + 1).map((num) => (
        <Stage
          key={num}
          level={level}
          stage={stage}
          selected={selected}
          index={num}
          score={score}
          isCorrect={isCorrect}
        />
      ))}
    </div>
  );
}
function Stage({ level, stage, selected, index, score, isCorrect }) {
  const [isGreen, setIsGreen] = useState(null);

  // console.log("Index" + index);
  // console.log("stage" + stage);

  return <p>⚫</p>;
}
