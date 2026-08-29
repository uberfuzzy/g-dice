import React from "react";
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

import { Dice } from "~components/Dice";
import { CubeStack } from "~components/Cube";
import { NameBox } from "~components/NameBox";

import { PlayersContext } from "~/contexts/players";
import { GameContext } from "~/contexts/game";
import { playerLookup } from "~util/players";

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

  const toTheCube = pdata.rolled.filter((dv) => {
    return dv === 3;
  });

  const p_left = playerLookup(pdata.left, players);
  const p_right = playerLookup(pdata.right, players);

  return (
    <>
      <div className={"playerCard"}>
        <>
          my name is <NameBox title={pdata.uuid}>{pdata.name}</NameBox>
          {pdata.wins > 0 && (
            <>
              , {pdata.wins} x <Emoji>🏆</Emoji>
            </>
          )}
        </>
        <br /> <br />
        {gameTurnCount === 0 && (
          <>
            {pdata?.left !== null && (
              <>
                My <Emoji cssclass={"leftNeighborTint"}>◀</Emoji> neighbor is:{" "}
                <NameBox dir={"left"} title={`${pdata.left} / ${p_left.uuid}`}>
                  {p_left.name}
                </NameBox>
                <br />
              </>
            )}
            {pdata?.right !== null && (
              <>
                My <Emoji cssclass={"rightNeighborTint"}>▶</Emoji> neighbor is:{" "}
                <NameBox dir={"right"} title={`${pdata.right} / ${p_right.uuid}`}>
                  {p_right.name}
                </NameBox>
                <br />
              </>
            )}
            <br />
          </>
        )}
        {pdata?.rolled.length == 0 && gameTurnCount > 0 && (
          <>
            <div>
              <>I had nothing to roll.</>
            </div>
          </>
        )}
        {pdata?.rolled.length > 0 && (
          <>
            <div>
              <>I rolled {pdata.rolled.length} 🎲 [{pdata.rolled.join(", ")}].</>
            </div>
            {
              toTheCube?.length > 0 && (
                <div>
                  <>Added [{toTheCube.join(", ")}] to cube.</>
                </div>
              )
            }
            <div>
              <>
                {leftGiveAway?.length > 0 && (
                  <>
                    I gave [{leftGiveAway.join(", ")}] <Emoji cssclass={"leftNeighborTint"}>◀</Emoji> to{" "}
                    <NameBox dir="left" title={p_left.uuid}>
                      {p_left.name}
                    </NameBox>
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
                    gave [{rightGiveAway.join(", ")}] <Emoji cssclass={"rightNeighborTint"}>▶</Emoji> to{" "}
                    <NameBox dir="right" title={p_right.uuid}>
                      {p_right.name}
                    </NameBox>
                  </>
                )}
              </>
            </div>
          </>
        )}
        <div className="playerDiceRow">
          <div className="playerCube">
            <CubeStack number={pdata.cube} />
            {pdata.winState !== false && (
              <>
                <br />
                <span className="winText">I HAVE COMPLETED MY CUBE [{pdata.winState}]</span>
              </>
            )}
          </div>
          <div>
            <div className="dicePool playerDicePool" data-number={pool.length || 0}>
              <div className="dicePoolGrid">
                {pool.map((dv, i) => {
                  return <Dice key={i} number={dv} />;
                })}
              </div>
              {(!pool || pool?.length <= 0) && <div className="noDiceBox">-no dice-</div>}
            </div>

            {gameTurnCount > 0 && (
              <div className="dicePool playerGiftPool" data-number={giftPool.length || 0}>
                <div className="dicePoolGrid">
                  {giftPool.map((dv, i) => {
                    return <Dice key={i} number={dv} />;
                  })}
                </div>
                {(!giftPool || giftPool?.length <= 0) && <div className="noDiceBox">-no gifted dice-</div>}
              </div>
            )}
          </div>
        </div>
        {gameState === GameStates.playing && gameTurnCount > 0 && (
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
