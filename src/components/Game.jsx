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
  const [gameOver, setGameOver] = useState(false)
  const [players, setPlayers] = useState([])
  const minPlayers = 3
  const maxPlayers = 5

  const createNewPlayer = () => {
    if (players?.length >= maxPlayers) return;
    const randomName = titleCase(uniqueNamesGenerator(ungConfigPlayer));

    const newPlayer = {
      id: 0,
      name: randomName,
      left: null,
      right: null,
      cube: 0,
      pool: new Array(7).fill(0),
      gifts: 0,
      win: false,
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
      if (p.gifts > 0) {
        p.pool = [...p.pool, ...new Array(p.gifts).fill(0)]
        p.gifts = 0;
      }

      const rolled = rollPool(p.pool);
      p.pool = [...rolled];
      return p;
    })

    setPlayers(npd)
  }

  const feedYourCube = () => {
    const npd = players.map((p, pi) => {
      const threeCount = p.pool.filter((dv) => { return dv === 3 }).length
      if (threeCount > 0) {
        p.cube += threeCount;
        const poolWithoutThrees = p.pool.filter((dv) => { return dv !== 3 })
        p.pool = [...poolWithoutThrees]
      }
      return p
    })

    setPlayers(npd)
  }

  const giftYourNeighbors = () => {
    const npd = players.map((p, pi) => {
      const onesCount = p.pool.filter((dv) => { return dv === 1 }).length
      players[p.left].gifts += onesCount
      p.pool = p.pool.filter((dv) => { return dv !== 1 })

      const sixesCount = p.pool.filter((dv) => { return dv === 6 }).length
      players[p.right].gifts += sixesCount
      p.pool = p.pool.filter((dv) => { return dv !== 6 })

      return p;
    })

    setPlayers(npd)
  }

  const gameIsWon = () => {
    let winners = []
    players.forEach((p, pi) => {
      if (p.cube >= 8) {
        winners.push(pi)
        p.win = p.pool.length + p.gifts;
      }
    })

    if (winners.length > 1) {
      console.log("gameIsWon()", winners)
      //if multiple win at same time, "the player with the fewer unstacked dice wins"
      let smallest = 0;
      winners.forEach((winnerId, i) => {
        const p = players[winnerId]
        const unstacked = p.pool.length + p.gifts;
        smallest = Math.min(smallest, unstacked)
        // console.log("winnerId=%o, i=%o, unstacked=%o, smallest=%o", winnerId, i, unstacked, smallest)
      })
      winners.forEach((winnerId, i) => {
        players[winnerId].win = players[winnerId].win === smallest ? smallest : false
      })

      setPlayers(players)
    }

    return winners.length > 0
  }

  const doATurn = () => {
    rollAllPools()
    feedYourCube()
    giftYourNeighbors()

    if (gameIsWon()) {
      //change game state machine to "done"
      setGameOver(true)
      return
    }
  }

  return (
    <GameContext.Provider value={gameStart}>
      <>
        <div className='gameControls' style={{ marginBottom: "1em", display: gameOver ? 'none' : 'block' }}>
          <div className='introBox' style={{ marginBottom: "1em", display: gameStart ? 'none' : 'block' }}>

            <button
              id='bNewPlayer'
              onClick={createNewPlayer}
              disabled={gameStart || players.length >= maxPlayers}
            >Add Player</button>
            &nbsp;&bull;&nbsp;
            <button
              id='bStartGame'
              onClick={startTheGame}
              disabled={gameStart || players.length < minPlayers}
            >StartGame</button>
          </div>

          <div className='turnControls' style={{ marginBottom: "1em", display: gameStart ? 'block' : 'none' }}>
            <button onClick={doATurn}>DO A TURN</button>
            {/* <br /><button onClick={rollAllPools}>everyone roll</button>
            &nbsp;<button onClick={feedYourCube}>feed your cube</button>
            &nbsp;<button onClick={giftYourNeighbors}>give gifts</button> */}
          </div>
        </div>
        {gameOver && <>
          <button style={{ float: "right" }} onClick={() => {
            setPlayers([])
            setGameStart(false)
            setGameOver(false)
          }}>reset?</button>
        </>}


        <table className='gameTable' border={0}>
          <caption style={{ whiteSpace: "nowrap" }}>{players.length || `Add ${minPlayers} to ${maxPlayers} players to play`} Players</caption>
          <tbody>
            {players.map((playerData, pi) => {
              return (
                <tr key={pi}><td style={{ marginTop: "1em" }}>

                  {/* i am #{playerData.id}
                  {playerData?.left !== null && <>
                    , my left neighbor is: ({playerData.left})<NameBox dir={'left'}>{players[playerData.left].name}</NameBox>
                  </>}
                  {playerData?.right !== null && <>
                    , my right neighbor is: ({playerData.right})<NameBox dir={'right'}>{players[playerData.right].name}</NameBox>
                  </>}
                  <br /> */}
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