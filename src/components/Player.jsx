import React from "react";
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { Dice } from "~components/Dice";
import { CubeStack } from "~components/Cube";
import { NameBox } from "~components/NameBox";

import { PlayersContext } from "~/contexts/players";
import { GameContext } from "~/contexts/game";

import "./Player.css";
import { Emoji } from "./Emoji";
import { GameStates } from "./Game";

export const getUnstacked = (pdata) => {
  return pdata.pool.length + pdata.gifts.length;
};

export const Player = ({ data: pdata }) => {
  const [pool, setPool] = useState(pdata.pool);
  const [giftPool, setGiftPool] = useState(pdata.gifts);

  let players = useContext(PlayersContext);
  const { gameState, gameTurnCount } = useContext(GameContext);

  useEffect(() => {
    setPool(pdata.pool);
  }, [pdata.pool]);

  useEffect(() => {
    setGiftPool(pdata.gifts);
  }, [pdata.gifts]);

  const leftGiveAway = pdata.rolled.filter((dv) => {
    return dv === 1;
  });

  const rightGiveAway = pdata.rolled.filter((dv) => {
    return dv === 6;
  });

  return (
    <>
      <div className={"playerDev"}>
        my name is <NameBox>{pdata.name}</NameBox>
        <br /> <br />
        {/* , <br /> */}
        {/* my cube is: {data.cube}, my pool({pool.length}) is [{pool.join(", ")}] , */}
        {/* my gifts is: {data.gifts}, */}
        {/* US={data.pool.length + data.gifts.length} */}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {pdata?.rolled.length > 0 && (
          <div>
            <>I rolled [{pdata.rolled.join(", ")}].</>
          </div>
        )}
        {pdata?.rolled.length > 0 && (
          <div>
            <>
              {leftGiveAway?.length > 0 && (
                <>
                  I gave [{leftGiveAway.join(", ")}] to
                  <NameBox>{players[pdata.left].name}</NameBox>
                </>
              )}
            </>
            <>
              {rightGiveAway?.length > 0 && (
                <>
                  {leftGiveAway?.length > 0 ? (
                    <>
                      ,<br />
                      and
                    </>
                  ) : (
                    <>I</>
                  )}{" "}
                  gave [{rightGiveAway.join(", ")}] to{" "}
                  <NameBox>{players[pdata.right].name}</NameBox>
                </>
              )}
            </>
          </div>
        )}
        <div className="playerDiceRow">
          <div className="playerCube">
            <CubeStack number={pdata.cube} />
            {pdata.win !== false && (
              <>
                <br />
                <span className="winText">
                  I HAVE COMPLETED MY CUBE [{pdata.win}]
                </span>
              </>
            )}
          </div>
          <div>
            <div
              className="playerDicePool"
              id="playerDicePool"
              data-number={pool.length || 0}
            >
              <div className="dicePoolGrid">
                {pool.map((dv, i) => {
                  return <Dice key={i} number={dv} />;
                })}
              </div>
              {(!pool || pool?.length <= 0) && (
                <div className="noDiceBox">-no dice-</div>
              )}
            </div>

            {gameTurnCount > 0 && (
              <div
                className="playerDicePool"
                id="playerGiftPool"
                data-number={giftPool.length || 0}
              >
                <div className="dicePoolGrid">
                  {giftPool.map((dv, i) => {
                    return <Dice key={i} number={dv} />;
                  })}
                </div>
                {(!giftPool || giftPool?.length <= 0) && (
                  <div className="noDiceBox">-no gifted dice-</div>
                )}
              </div>
            )}
          </div>
        </div>
        {gameState === GameStates.playing && (
          <div>
            I will roll {getUnstacked(pdata)} <Emoji>🎲</Emoji> next round
          </div>
        )}
      </div>
    </>
  );
};

Player.propTypes = {
  data: PropTypes.object,
};

// Player.defaultProps = {
// }

export default Player;
