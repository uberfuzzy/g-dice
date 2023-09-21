import React from 'react';
import { useState } from 'react';

import { Player } from "./Player"
// import { Dice } from "./Dice"
// import { PipGrid } from "./PipGrid"
// import { rollD6 } from "../util/dice"
import { titleCase } from "../util/strings"
import { GameContext } from "../contexts/gameState"

import {
  uniqueNamesGenerator,
  names as ungNames,
  colors as ungColors
} from 'unique-names-generator';

const ungConfigPlayer = {
  dictionaries: [ungColors, ungNames],
  length: 2,
  separator: ' '
}

function Game() {
  const [gameStart, setGameStart] = useState(false)
  const [players, setPlayers] = useState([])

  const createNewPlayer = () => {
    const randomName = titleCase(uniqueNamesGenerator(ungConfigPlayer));
    const newPlayer = <Player name={randomName} />
    setPlayers([...players, newPlayer]);
  }

  const startTheGame = () => {
    setGameStart(true);
    // associate the neighbors
    console.log('the game is start');
  }

  return (
    <div>
      <GameContext.Provider value={gameStart}>
        <button id='bNewPlayer' onClick={createNewPlayer} disabled={gameStart}>Add Player</button>
        <button id='bStartGame' onClick={startTheGame} disabled={gameStart || players.length < 2}>StartGame</button>

        <table border={1}>
          <tbody>
            {players.map((pv, pi) => {
              return (
                <tr key={pi}><td>
                  {pv}
                </td></tr>
              )
            })}
          </tbody>
        </table>
      </GameContext.Provider>
    </div >
  );
}

export default Game;