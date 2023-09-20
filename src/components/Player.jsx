import React from 'react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import "./Player.css"
import { rollD6 } from '../util/dice';
import { Dice } from "./Dice"

export const Player = ({ name }) => {
    const [pool, setPool] = useState([])

    useEffect(() => {
        setPool(new Array(7).fill(0))
    }, [])

    const rollPool = () => {
        const np = pool.map((pv, pi) => {
            return rollD6();
        })

        setPool(np);
    }

    const sortPool = () => {
        let np = [...pool]
        np = np.sort((a, b) => a - b)
        setPool(np)
    }

    return (
        <>
            <div className={"playerDev"}>
                my name is {name}, my pool({pool.length}) is [{pool.join(', ')}],

                <div className="playerDicePool">
                    {pool.map((dv, i) => {
                        return <Dice key={i} number={dv} />
                    })}
                </div>

                <button onClick={() => {
                    let nu = rollD6();
                    setPool([...pool, nu]);
                }}>add</button>

                &nbsp;<button onClick={rollPool}>roll pool</button>
                &nbsp;<button onClick={sortPool}>sort pool</button>
            </div>
        </>
    );
}


Player.propTypes = {
    name: PropTypes.string,
};

Player.defaultProps = {
    name: "-",
}

export default Player;