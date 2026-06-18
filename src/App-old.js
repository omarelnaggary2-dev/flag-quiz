import { useState, useEffect } from "react";
function getRandomCountry(data) {
  const entries = Object.entries(data);
  const randomIndex = Math.floor(Math.random() * entries.length);
  const [code, name] = entries[randomIndex];

  return { code, name };
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



export default function App() {
  //STATES
  const [countryList, setCountryList] = useState(null);
  const [stage, setStage] = useState(0);
  //VARIABLES
  let gameSize = 5;
  useEffect(() => {
    fetch("https://flagcdn.com/en/codes.json")
      .then((res) => res.json())
      .then((data) => {
        setCountryList(data);
      });
  }, []);

  //FUNCTIONS
  function handleProgress() {
    setStage((stage) => stage + 1);
  }

  function handleOption() {
    handleProgress();
  }

  return (
    <div className="App">
      <h1>FLAG QUIZ</h1>
      {countryList && (
        <Quiz
          countryList={countryList}
          stage={stage}
          handleProgress={handleProgress}
          handleOption={handleOption}
          gameSize={gameSize}
        />
      )}
    </div>
  );
}

function Quiz({ countryList, stage, handleProgress, handleOption, gameSize }) {
  //STATES
  const [randCountry, setRandCountry] = useState(() =>
    countryList ? getRandomCountry(countryList) : null,
  );
  const [choices, setChoices] = useState([]);

  //GENERATE CHOICES
  useEffect(() => {
    if (!randCountry) return;

    const newChoices = [randCountry];

    while (newChoices.length < 4) {
      const candidate = getRandomCountry(countryList);

      // ✅ ensure it's not already in choices
      if (!newChoices.some((c) => c.code === candidate.code)) {
        newChoices.push(candidate);
      }
    }

    setChoices(newChoices);
  }, [randCountry]);
  console.log(choices);

  //VARIABLES

  //FUNCTIONS

  function handleQuestion() {
    setRandCountry(() => getRandomCountry());
  }

  // console.log(getRandomCountry())
  // setRandCountry({code:"eg", name:"egypt"})

  return (
    <div>
      <Flag current={randCountry} stage={stage} />
      <Answers
        answer={randCountry}
        choices={choices}
        handleOption={handleOption}
      />
      <ProgressBar stage={stage} gameSize={gameSize} />
    </div>
  );
}
function Flag({ current, stage }) {
  console.log("Current: " + current.code);
  return (
    <div>
      <img
        src={`https://flagcdn.com/w160/${current.code}.png`}
        // srcSet={`https://flagcdn.com/w320/${x}.png 2x`}
        width="160"
        alt={"Egypt"}
      ></img>
    </div>
  );
}
function Answers({ current, choices, handleOption }) {
  const shuffled = shuffle(choices.slice());
  console.log(choices);

  return (
    <div>
      <Option onClick={handleOption}>{shuffled[0]?.name}</Option>
      <Option onClick={handleOption}>{shuffled[1]?.name}</Option>
      <Option onClick={handleOption}>{shuffled[2]?.name}</Option>
      <Option onClick={handleOption}>{shuffled[3]?.name}</Option>
    </div>
  );
}
function Option({ children, onClick }) {
  return <button onClick={() => onClick()}>{children}</button>;
}
function ProgressBar({ gameSize, stage }) {
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: gameSize }, (_, i) => i + 1).map((num) => (
        <Stage order={num} stage={stage} key={num} />
      ))}
    </div>
  );
}
function Stage({ order, stage }) {
  return <p>{stage >= order ? "x" : order}</p>;
}
