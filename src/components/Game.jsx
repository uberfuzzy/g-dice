import React from "react";
import { useState } from "react";

import {
  uniqueNamesGenerator,
  names as ungNames,
  colors as ungColors,
} from "unique-names-generator";

import { v4 as uuid } from "uuid";

import { Player, getUnstacked } from "~components/Player";
import { NameBox } from "~components/NameBox";
import { Emoji } from "~components/Emoji";
import { GameOverBox } from "~/components/GameOverBox";

import { GameContext } from "~/contexts/game";
import { PlayersContext } from "~contexts/players";

import { rollD6 } from "~util/dice";
import { titleCase } from "~util/strings";
import { playerLookup } from "~util/players";

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
      uuid: uuid(),
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
      wins: 0,
    };
    return resetPlayerGameData(player);
  };

  const resetPlayerGameData = (player) => {
    player = {
      ...player,
      cube: 0,
      pool: new Array(7).fill(0),
      gifts: [],
      winState: false,
      rolled: [],
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
    let nlefts = [
      ...players.map((p) => {
        return p.uuid;
      }),
    ];
    nlefts.unshift(nlefts.pop());

    let nrights = [
      ...players.map((p) => {
        return p.uuid;
      }),
    ];
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

    // np = np.sort((a, b) => a - b);

    return np;
  };

  const rollAllPools = () => {
    const npd = players.map((p, pi) => {
      //combine gifts back into pool
      if (p.gifts.length > 0) {
        p.pool = [...p.pool, ...p.gifts];
        p.gifts = [];
      }

      // roll all the pool dice, save record into rolled
      p.rolled = rollPool(p.pool);

      // but copy it
      p.pool = [...p.rolled];
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

      const pleft = playerLookup(p.left, players);
      pleft.gifts = [...pleft.gifts, ...new Array(onesCount).fill(1)];
      p.pool = p.pool.filter((dv) => {
        return dv !== 1;
      });

      const sixesCount = p.pool.filter((dv) => {
        return dv === 6;
      }).length;
      const pright = playerLookup(p.right, players);
      pright.gifts = [...pright.gifts, ...new Array(sixesCount).fill(6)];
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
        winners.push(p.uuid);
        p.win = getUnstacked(p);
      }
    });

    if (winners.length > 0) {
      console.log("gameIsWon()", winners);
    }

    if (winners.length > 1) {
      // console.log("gameIsWon(), tie race");
      //if multiple win at same time, "the player with the fewer unstacked dice wins"
      let smallest = 0;
      winners.forEach((winnerUuid, i) => {
        const p = playerLookup(winnerUuid, players);
        const unstacked = p.win;
        smallest = Math.min(smallest, unstacked);
      });

      winners = winners.filter((winnerUuid) => {
        const p = playerLookup(winnerUuid, players);
        return p.win === smallest;
      });
    }
    setWinState(winners);

    winners.forEach((winnerUuid, i) => {
      const p = playerLookup(winnerUuid, players);
      p.wins += 1;
    });
    setPlayers(players);

    return winners.length > 0;
  };

  const gameIsOver = () => {
    let playersWithDice = 0;

    players.forEach((p) => {
      if (getUnstacked(p)) {
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
      console.log("game has been lost");
      setGameState(GameStates.over);
      setWinState(false);
      return;
    }
  };

  // keep players names, wipe their internals, reset game state
  const resetTable = () => {
    console.log("game is re-start");
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
    <GameContext.Provider value={{ gameState, gameTurnCount, winState }}>
      <PlayersContext.Provider value={players}>
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
                  key={0}
                  onClick={resetTable}
                  style={{ float: "left" }}
                  title="keep but reset players"
                >
                  play another round?
                </button>
                <button
                  key={1}
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
              {winState === false && <GameOverBox type="lose" />}
              {winState !== false && <GameOverBox type="win" />}
            </>
          )}

          <div className="gameStats">
            {players.length} Players
            {[GameStates.playing, GameStates.over].includes(gameState) && (
              <>, Turn {gameTurnCount}</>
            )}
          </div>

          <div className="playerTable">
            {players.map((playerData, pi) => {
              return <Player key={pi} data={playerData} />;
            })}
          </div>
        </>
      </PlayersContext.Provider>
    </GameContext.Provider>
  );
}

export default Game;
