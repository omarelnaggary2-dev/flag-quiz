import { useState, useEffect } from "react";
function getRandomCountry(data) {
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
      // console.log("Correct code:" + correctCode);
      // console.log("Correct Name:" + correctName.code);
      // console.log("Index:" + index);

      //TAKE 3 DISTRACTORS (NEXT 3 ELEMENTS IN ARRAY)
      const distractors = shuffledEntries.slice(len + index, len + index + 3);

      // console.log(distractors)

      //COMBINE CORRECT + DISTRACTORS
      const rawOptions = [[correctCode, correctName], ...distractors];

      // console.log(rawOptions)

      //BUILD OPTIONS ARRAY * len

      const options = rawOptions.map(([code, name]) => ({
        countryName: name,
        countryCode: code,
        isCorrect: code === correctCode,
      }));

      // console.log(options)

      //SHUFFLE THE 4 OPTIONS
      const shuffledOptions = shuffle(options);

      // console.log(shuffledOptions)

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
  const gameLength = 10;

  const [stage, setStage] = useState(0);
  const [gameOn, setGameOn] = useState(false);

  // const levelList = createLevel();

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

  // console.log(level);

  function nextStage() {
    if (stage === 0 && !gameOn) handleStartGame();
    if (stage >= gameLength) handleLastStage();
    else setStage((stage) => stage + 1);
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
  }

  return (
    <div className="App">
      <h1>
        FLAG QUIZ stage: {stage}/{gameLength} {gameOn ? "Game On" : "Game Off"}
      </h1>
      <button className="stage-navigation" onClick={() => prevStage()}>
        {"<"}
      </button>
      <button className="stage-navigation" onClick={() => nextStage()}>
        {">"}
      </button>
      {gameOn && <Quiz level={level} stage={stage} gameLength={gameLength} />}
    </div>
  );
}

function Quiz({ level, stage, gameLength }) {
  //STATES
  //VARIABLES
  //FUNCTIONS

  return (
    stage > gameLength || (
      <div>
        <Flag image={level[stage - 1].imageLink} />
        <Answers options={level[stage - 1].options} />
        <ProgressBar />
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
function Answers({ options }) {
  console.log(options);
  const [selected, setSelected] = useState(null);
  function handleSelect() {
    if (!selected) setSelected(1);
    else setSelected(null);
  }
  // console.log(selected);

  return (
    <div>
      {options.map((opt) => (
        <Option
          key={opt.countryCode}
          selected={selected}
          onSelect={handleSelect}
        >
          {opt.countryName.name}
        </Option>
      ))}
    </div>
  );
}
function Option({ children, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      style={selected && { backgroundColor: "gray", color: "white" }}
    >
      {children}
    </button>
  );
}
function ProgressBar() {
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <Stage key={num} />
      ))}
    </div>
  );
}
function Stage() {
  return <p>o</p>;
}
