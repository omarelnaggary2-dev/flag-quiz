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
  //STATES & VARIABLES
  const gameLength = 10;

  const [stage, setStage] = useState(1);

  //FUNCTIONS
  function nextStage(){
    if (stage>=10) return;
    setStage(stage=>stage+1)
  }
  function prevStage(){
    if (stage<=1) return;
    setStage(stage=>stage-1)
  }

  return (
    <div className="App">
      <h1>
        FLAG QUIZ stage: {stage}/{gameLength}
      </h1>
      <button className="stage-navigation" onClick={()=>prevStage()}>{"<"}</button>
      <button className="stage-navigation" onClick={()=>nextStage()}>{">"}</button>
      <Quiz />
    </div>
  );
}

function Quiz() {
  //STATES
  //VARIABLES
  //FUNCTIONS

  return (
    <div>
      <Flag />
      <Answers />
      <ProgressBar />
    </div>
  );
}
function Flag() {
  return (
    <div>
      <img
        src={`https://flagcdn.com/w160/eg.png`}
        // srcSet={`https://flagcdn.com/w320/${x}.png 2x`}
        width="160"
        alt={"Egypt"}
      ></img>
    </div>
  );
}
function Answers() {
  return (
    <div>
      <Option>Option 1</Option>
      <Option>Option 2</Option>
      <Option>Option 3</Option>
      <Option>Option 4</Option>
    </div>
  );
}
function Option({ children }) {
  return <button>{children}</button>;
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
