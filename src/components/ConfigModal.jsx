import { Square } from './Square.jsx'
import { SYMBOL, MODE, FIRST_TURN } from '../constants.js'
import { saveConfigToStorage } from '../logic/storage.js';
import { useState } from 'react';

export function ConfigModal ({ isConfig, setIsConfig, resetGame }) {

    if(!isConfig) return null; // Si la configuración está cerrada, no se muestra

    const [symbol, setSymbol ] = useState(() => {
        return window.localStorage.getItem('symbol') ?? SYMBOL.X
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
        //setConfigParams({symbol, mode, firstTurn});
        saveConfigToStorage({symbol, mode, firstTurn});
        resetGame();
    }

    const setSymbolX = () => { setSymbol(SYMBOL.X) }
    const setSymbolO = () => { setSymbol(SYMBOL.O) }

    const setModeTwoPlayers = () => { setMode(MODE.TWO_PLAYERS) }
    const setModeVsIA = () => { setMode(MODE.VS_IA) }

    const setFirstTurnMe = () => { setFirstTurn(FIRST_TURN.ME) }
    const setFirstTurnIA = () => { setFirstTurn(FIRST_TURN.IA) }

    const boxClasses = `box ${mode == MODE.TWO_PLAYERS ? 'box-small' : ''}`;

    return (
        <section className="winner">
            <div className={boxClasses}>
                <div className="close" onClick={closeIsConfig}><a>x</a></div>
                <h2>Elegir símbolo:</h2>
                <div className="chooseSymbol">
                    <header className="win symbolToChoose" onClick={setSymbolX}>
                        <Square isSelected={symbol == SYMBOL.X}>{SYMBOL.X}</Square>
                    </header>
                    <header className="win symbolToChoose" onClick={setSymbolO}>
                        <Square isSelected={symbol == SYMBOL.O}>{SYMBOL.O}</Square>
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
                {
                    mode == MODE.VS_IA ? (
                        <>
                            <h2>Elegir quien empieza:</h2>
                            <div className="chooseSymbol">
                                <header className="win symbolToChoose" onClick={setFirstTurnMe}>
                                    <Square isSelected={firstTurn == FIRST_TURN.ME}>{FIRST_TURN.ME}</Square>
                                </header>
                                <header className="win symbolToChoose" onClick={setFirstTurnIA}>
                                    <Square isSelected={firstTurn == FIRST_TURN.IA}>{FIRST_TURN.IA}</Square>
                                </header>
                            </div>
                        </>
                    ) : null
                }
                
                <footer>
                    <button onClick={saveConfig}>
                        <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path>
                            <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M14 4l0 4l-6 0l0 -4"></path>
                        </svg>
                        Guardar
                    </button>
                </footer>
            </div>
        </section>
    )
}