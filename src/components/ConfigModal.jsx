import { Square } from './Square.jsx'
import { TURNS, MODE, FIRST_TURN } from '../constants.js'
import { saveConfigToStorage } from '../logic/storage.js';
import { useState } from 'react';

export function ConfigModal ({ isConfig, setIsConfig, resetGame }) {
    if(!isConfig) return null;

    const [simbol, setSimbol ] = useState(() => {
        return window.localStorage.getItem('simbol') ?? TURNS.X
    });
    const [mode, setMode ] = useState(() => {
        return window.localStorage.getItem('mode') ?? MODE.TWO_PLAYERS
    });
    const [firstTurn, setFirstTurn ] = useState(() => {
        return window.localStorage.getItem('firstTurn') ?? FIRST_TURN.ME
    });

    const closeIsConfig = () => {
        setIsConfig(false);
    }

    const saveConfig = () => {
        saveConfigToStorage({simbol, mode, firstTurn})
        resetGame();
    }

    const setSimbolX = () => { setSimbol(TURNS.X) }
    const setSimbolO = () => { setSimbol(TURNS.O) }

    const setModeTwoPlayers = () => { setMode(MODE.TWO_PLAYERS) }
    const setModeVsIA = () => { setMode(MODE.VS_IA) }

    const setFirstTurnMe = () => { setFirstTurn(FIRST_TURN.ME) }
    const setFirstTurnIA = () => { setFirstTurn(FIRST_TURN.IA) }

    return (
        <section className="winner">
            <div className="box">
                <div className="close" onClick={closeIsConfig}><a>x</a></div>
                <h2>Elegir simbolo:</h2>
                <div className="chooseSymbol">
                    <header className="win symbolToChoose" onClick={setSimbolX}>
                        <Square isSelected={simbol == TURNS.X}>{TURNS.X}</Square>
                    </header>
                    <header className="win symbolToChoose" onClick={setSimbolO}>
                        <Square isSelected={simbol == TURNS.O}>{TURNS.O}</Square>
                    </header>
                </div>
                <h2>Elegir modo de juego:</h2>
                <div className="chooseSymbol">
                    <header className="win symbolToChoose" onClick={setModeTwoPlayers}>
                        <Square isSelected={mode == MODE.TWO_PLAYERS}>{MODE.TWO_PLAYERS}</Square>
                    </header>
                    <header className="win symbolToChoose" onClick={setModeVsIA}>
                        <Square isSelected={mode == MODE.VS_IA}>{MODE.VS_IA}</Square>
                    </header>
                </div>
                <h2>Elegir quien empieza:</h2>
                <div className="chooseSymbol">
                    <header className="win symbolToChoose" onClick={setFirstTurnMe}>
                        <Square isSelected={firstTurn == FIRST_TURN.ME}>{FIRST_TURN.ME}</Square>
                    </header>
                    <header className="win symbolToChoose" onClick={setFirstTurnIA}>
                        <Square isSelected={firstTurn == FIRST_TURN.IA}>{FIRST_TURN.IA}</Square>
                    </header>
                </div>
                <footer>
                    <button onClick={saveConfig}>Guardar cambios</button>
                </footer>
            </div>
        </section>
    )
}