import React from 'react';
import { useState } from 'react';

import "./Game.css"

import { Player } from "./Player"
// import { Dice } from "./Dice"
// import { PipGrid } from "./PipGrid"
// import { rollD6 } from "../util/dice"
import { titleCase } from "../util/strings"
import { GameContext } from "../contexts/gameState"
import { NameBox } from "./NameBox"
import { rollD6 } from '../util/dice';

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
    if (players?.length >= 7) return;
    const randomName = titleCase(uniqueNamesGenerator(ungConfigPlayer));

    const newPlayer = {
      id: 0,
      name: randomName,
      left: null,
      right: null,
      cube: 0,
      pool: new Array(7).fill(0)
    }
    newPlayer.id = players.length;

    setPlayers([...players, newPlayer]);
  }

  const startTheGame = () => {
    // associate the neighbors
    identifyNeighbors();

    setGameStart(true);

    console.log('the game is start');
  }

  const identifyNeighbors = () => {
    let nlefts = [...players.keys()]
    nlefts.unshift(nlefts.pop())

    let nrights = [...players.keys()]
    nrights.push(nrights.shift())

    const npd = players.map((p, pi) => {
      p.left = nlefts[pi];
      p.right = nrights[pi];
      return p
    })
    setPlayers(npd);
  }

  const rollPool = (pool) => {
    let np = pool.map(() => {
      return rollD6();
    })

    np = np.sort((a, b) => a - b)

    return np
  }

  const rollAllPools = () => {
    const npd = players.map((p, pi) => {
      const rolled = rollPool(p.pool);
      p.pool = [...rolled];
      return p;
    })

    setPlayers(npd)
  }

  return (
    <GameContext.Provider value={gameStart}>
      <>
        <div className='introBox' style={{ marginBottom: "1em", display: gameStart ? 'none' : 'block' }}>

          <button id='bNewPlayer' onClick={createNewPlayer} disabled={gameStart || players.length >=
            7}>Add Player</button>&nbsp;
          <button id='bStartGame' onClick={startTheGame} disabled={gameStart || players.length < 3}>StartGame</button>
        </div>

        <div className='gameControls' style={{ marginBottom: "1em", display: gameStart ? 'block' : 'none' }}>
          <button onClick={rollAllPools}>everyone roll</button>&nbsp;
          <button><s>feed your cube</s></button>&nbsp;
          <button><s>give gifts</s></button>
        </div>

        <table className='gameTable' border={0}>
          <caption style={{ whiteSpace: "nowrap" }}>{players.length || "Add 3 to 7 players to play"} Players</caption>
          <tbody>
            {players.map((playerData, pi) => {
              return (
                <tr key={pi}><td style={{ marginTop: "1em" }}>

                  i am ({pi}/{playerData.id})
                  {playerData?.left !== null && <>
                    , my left neighbor is: ({playerData.left})<NameBox dir={'left'}>{players[playerData.left].name}</NameBox>
                  </>}
                  {playerData?.right !== null && <>
                    , my right neighbor is: ({playerData.right})<NameBox dir={'right'}>{players[playerData.right].name}</NameBox>
                  </>}
                  <br />
                  <Player data={playerData} />
                </td></tr>
              )
            })}
          </tbody>
        </table>
      </>
    </GameContext.Provider >
  );
}

export default Game;