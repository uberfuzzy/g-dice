import { useState } from 'react';
import './App.css';
import { Dice } from "./components/Dice"
import { PipGrid } from "./components/PipGrid"
import { Player } from "./components/Player"
import { rollD6 } from './util/dice';

function App() {
  const [rnum, setRnum] = useState(rollD6)

  const clicker = () => {
    setRnum(rollD6)
  }

  return (
    <div className="App">

      <fieldset>
        <legend>raw PipGrid testing</legend>
        <table border={1}><tbody><tr>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((p, pi) => {
            return <td key={`pg-test-${pi}`}><PipGrid title={`pg-test-${pi}`} value={p} /></td>
          })}
        </tr></tbody></table>
      </fieldset>
      <hr />

      <fieldset>
        <legend>Dice testing</legend>

        fixed=6<br />
        <Dice number={6} /><br />
        <hr />

        by loop,<br />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((p, i) => {
          return <Dice key={`d-test-${i}`} number={p} />
        })}
        <hr />

        by stateVar,<br />
        rnum={rnum}<br />
        <Dice number={rnum} /><br />

        <button onClick={() => {
          console.log("button onclick, rnum was", rnum)
          clicker()
        }}>roll rnum</button>
      </fieldset>


      <fieldset>
        <legend>Player testing</legend>
        <Player name="Alice" />
        {/* <hr />
        <Player name="Bob" /> */}
      </fieldset>

    </div>
  );
}

export default App;
