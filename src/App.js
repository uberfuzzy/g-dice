import { useState } from 'react';
import './App.css';
import { Dice } from "./components/Dice"
import PipGrid from './components/PipGrid';

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function App() {
  const [rnum, setRnum] = useState(rollD6)

  const clicker = () => {
    setRnum(rollD6)
  }

  return (
    <div className="App">

      <fieldset>
        <legend>PipGrid testing</legend>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => {
          return <PipGrid key={`test${p}`} value={p} />
        })}
      </fieldset>
      <hr />

      <fieldset>
        <legend>Dice testing</legend>

        fixed=6<br />
        <Dice number={6} /><br />
        <hr />

        rnum={rnum}<br />
        <Dice number={rnum} /><br />

        <button onClick={() => {
          console.log("button onclick, rnum was", rnum)
          clicker()
        }}>roll rnum</button>
      </fieldset>
    </div>
  );
}

export default App;
