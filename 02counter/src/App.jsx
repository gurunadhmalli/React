import { useState } from "react";
import "./App.css";

function App() {
  const [counter, setCounter] = useState(15);
  // let counter = 15;

  function addValue() {
    setCounter((prevCounter) => prevCounter + 1);
    setCounter((prevCounter) => prevCounter + 1);
    setCounter((prevCounter) => prevCounter + 1);
    // setCounter(counter + 1);
  }
  function removeValue() {
    setCounter((prevCounter) => prevCounter - 1);
    setCounter((prevCounter) => prevCounter - 1);
    setCounter((prevCounter) => prevCounter - 1);
  }

  return (
    <>
      <h1>React with me {counter}</h1>
      <h1>Counter:{counter}</h1>
      <button onClick={addValue}>Add Value</button>{" "}
      <button onClick={removeValue}>Remove Value</button>
      <p>footer:{counter}</p>
    </>
  );
}

export default App;
