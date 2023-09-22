import React from "react";
import { useState } from "react";

import {
  uniqueNamesGenerator,
  names as ungNames,
  colors as ungColors,
} from "unique-names-generator";

import { Player } from "~components/Player";
import { GameContext } from "~contexts/gameState";
import { NameBox } from "~components/NameBox";
import { Emoji } from "~components/Emoji";

import { rollD6 } from "~util/dice";
import { titleCase } from "~util/strings";

import "./Game.css";

const ungConfigPlayer = {
  dictionaries: [ungColors, ungNames],
  length: 2,
  separator: " ",
};

export const GameStates = {
  start: 0,
  playing: 1,
  over: 2,
};

function Game() {
  const [gameState, setGameState] = useState(GameStates.start);
  const [winState, setWinState] = useState(false);

  const [players, setPlayers] = useState([]);
  const [gameTurnCount, setTurn] = useState(0);

  const minPlayers = 3;
  const maxPlayers = 5;

  const createNewPlayer = () => {
    if (players?.length >= maxPlayers) return;
    const randomName = titleCase(uniqueNamesGenerator(ungConfigPlayer));

    let newPlayer = initPlayer({
      id: players.length, // TODO find better way to "get next id"
      name: randomName,
    });

    setPlayers([...players, newPlayer]);
  };

  const initPlayer = (player) => {
    player = {
      // note: name and id should be sent in
      ...player,
      left: null,
      right: null,
    };
    return resetPlayerGameData(player);
  };

  const resetPlayerGameData = (player) => {
    player = {
      ...player,
      cube: 0,
      pool: new Array(7).fill(0),
      gifts: 0,
      win: false,
    };
    return player;
  };

  const startTheGame = () => {
    // associate the neighbors
    identifyNeighbors();

    setGameState(GameStates.playing);

    console.log("the game is start");
  };

  const identifyNeighbors = () => {
    let nlefts = [...players.keys()];
    nlefts.unshift(nlefts.pop());

    let nrights = [...players.keys()];
    nrights.push(nrights.shift());

    const npd = players.map((p, pi) => {
      p.left = nlefts[pi];
      p.right = nrights[pi];
      return p;
    });
    setPlayers(npd);
  };

  const rollPool = (pool) => {
    let np = pool.map(() => {
      return rollD6();
    });

    np = np.sort((a, b) => a - b);

    return np;
  };

  const rollAllPools = () => {
    const npd = players.map((p, pi) => {
      if (p.gifts > 0) {
        p.pool = [...p.pool, ...new Array(p.gifts).fill(0)];
        p.gifts = 0;
      }

      const rolled = rollPool(p.pool);
      p.pool = [...rolled];
      return p;
    });

    setPlayers(npd);
  };

  const feedYourCube = () => {
    const npd = players.map((p, pi) => {
      const threeCount = p.pool.filter((dv) => {
        return dv === 3;
      }).length;
      if (threeCount > 0) {
        p.cube += threeCount;
        const poolWithoutThrees = p.pool.filter((dv) => {
          return dv !== 3;
        });
        p.pool = [...poolWithoutThrees];
      }
      return p;
    });

    setPlayers(npd);
  };

  const giftYourNeighbors = () => {
    const npd = players.map((p, pi) => {
      const onesCount = p.pool.filter((dv) => {
        return dv === 1;
      }).length;
      players[p.left].gifts += onesCount;
      p.pool = p.pool.filter((dv) => {
        return dv !== 1;
      });

      const sixesCount = p.pool.filter((dv) => {
        return dv === 6;
      }).length;
      players[p.right].gifts += sixesCount;
      p.pool = p.pool.filter((dv) => {
        return dv !== 6;
      });

      return p;
    });

    setPlayers(npd);
  };

  const gameIsWon = () => {
    let winners = [];
    players.forEach((p, pi) => {
      if (p.cube >= 8) {
        winners.push(pi);
        p.win = p.pool.length + p.gifts;
      }
    });

    if (winners.length > 0) {
      console.log("gameIsWon()", winners);
    }

    if (winners.length > 1) {
      console.log("gameIsWon(), tie race");
      //if multiple win at same time, "the player with the fewer unstacked dice wins"
      let smallest = 0;
      winners.forEach((winnerId, i) => {
        const p = players[winnerId];
        const unstacked = p.pool.length + p.gifts;
        smallest = Math.min(smallest, unstacked);
        // console.log("winnerId=%o, i=%o, unstacked=%o, smallest=%o", winnerId, i, unstacked, smallest)
      });
      console.log("gameIsWon(), smallest found=", smallest);

      winners = winners.filter((winnerId) => {
        return players[winnerId].win === smallest;
      });

      setPlayers(players);
    }
    setWinState(winners);

    return winners.length > 0;
  };

  const gameIsOver = () => {
    let playersWithDice = 0;

    players.forEach((p) => {
      if (p.pool.length + p.gifts) {
        playersWithDice += 1;
      }
    });

    if (playersWithDice === 0) {
      // game is deadlock, everyone looses
      return true;
    }
  };

  const doATurn = () => {
    setTurn((x) => x + 1);
    rollAllPools();
    feedYourCube();
    giftYourNeighbors();

    if (gameIsWon()) {
      setGameState(GameStates.over);
      return;
    }

    if (gameIsOver()) {
      setGameState(GameStates.over);
      setWinState(false);
      return;
    }
  };

  // keep players names, wipe their internals, reset game state
  const resetTable = () => {
    const npd = players.map((p, pi) => {
      return resetPlayerGameData(p);
    });
    setPlayers(npd);

    setTurn(0);
    setWinState(false);
    setGameState(GameStates.playing);
  };

  // reset everything
  const resetWorld = () => {
    if (!window.confirm("reset world?")) return;
    setPlayers([]);
    setTurn(0);
    setWinState(false);
    setGameState(GameStates.start);
  };

  return (
    <GameContext.Provider value={gameState}>
      <>
        <div className="gameControls">
          {gameState === GameStates.start && (
            <>
              <div className="introBox">
                <button
                  id="bNewPlayer"
                  onClick={createNewPlayer}
                  disabled={players.length >= maxPlayers}
                >
                  Add Player
                </button>
                &nbsp;&bull;&nbsp;
                <button
                  id="bStartGame"
                  onClick={startTheGame}
                  disabled={players.length < minPlayers}
                >
                  StartGame
                </button>
                <br />
                Add {minPlayers} to {maxPlayers} players to play
              </div>
            </>
          )}

          {gameState === GameStates.playing && (
            <div className="turnControls">
              <button
                onClick={doATurn}
                title="everyone rolls, feed your cube, give gifts, check for winners"
              >
                DO A TURN
              </button>
              {/* <br /><button onClick={rollAllPools}>everyone roll</button>
            &nbsp;<button onClick={feedYourCube}>feed your cube</button>
          &nbsp;<button onClick={giftYourNeighbors}>give gifts</button> */}
            </div>
          )}
          {gameState === GameStates.over && (
            <div
              className="overControls"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <button
                onClick={resetTable}
                style={{ float: "left" }}
                title="keep but reset players"
              >
                play another round?
              </button>
              <button
                onClick={resetWorld}
                style={{ float: "right" }}
                title="reset everything"
              >
                reset game?
              </button>
            </div>
          )}
        </div>

        {gameState === GameStates.over && (
          <>
            {winState === false && (
              <>
                <div
                  className="gameOverBox"
                  style={{
                    backgroundColor: "pink",
                    borderColor: "red",
                  }}
                >
                  <Emoji>☠</Emoji> NO WINNERS, CUBES REVOLT, EVERYONE EATEN{" "}
                  <Emoji>☠</Emoji>
                </div>
              </>
            )}
            {winState !== false && (
              <>
                <div
                  className="gameOverBox"
                  style={{
                    backgroundColor: "lime",
                    borderColor: "green",
                  }}
                >
                  🏆 WINNER{winState?.length > 1 && <>S</>} DETECTED,{" "}
                  {winState.map((playerId, loopId, arr) => {
                    console.log(playerId, loopId, arr);
                    return (
                      <>
                        {loopId > 0 && <>, </>}
                        <NameBox>{players[playerId].name}</NameBox>
                      </>
                    );
                  })}{" "}
                  🏆
                </div>
              </>
            )}
          </>
        )}

        <table className="gameTable" border={0}>
          <caption style={{ whiteSpace: "nowrap" }}>
            {players.length} Players
            {[GameStates.playing, GameStates.over].includes(gameState) && (
              <>, Turn {gameTurnCount}</>
            )}
          </caption>
          <tbody>
            {players.map((playerData, pi) => {
              return (
                <tr key={pi}>
                  <td style={{ marginTop: "1em" }}>
                    {/* i am #{playerData.id}
                  {playerData?.left !== null && <>
                    , my left neighbor is: ({playerData.left})<NameBox dir={'left'}>{players[playerData.left].name}</NameBox>
                  </>}
                  {playerData?.right !== null && <>
                    , my right neighbor is: ({playerData.right})<NameBox dir={'right'}>{players[playerData.right].name}</NameBox>
                  </>}
                  <br /> */}
                    <Player data={playerData} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    </GameContext.Provider>
  );
}

export default Game;
