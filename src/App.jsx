import './App.css'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { SYMBOL, MODE, FIRST_TURN } from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js'
import { saveGameToStorage, resetGameStorage } from './logic/storage.js'

import { Menu } from './components/Menu'
import { Board } from './components/Board.jsx'
import { Turn } from './components/Turn'
import { WinnerModal } from './components/WinnerModal'
import { ConfigModal } from './components/ConfigModal'


function App() {

    /**
     * Use States
     */
    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem('board');
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
    });

    const [symbol, setSymbol] = useState(() => {
        const actualSymbolFromStorage = window.localStorage.getItem('actualSymbol'); 
        const firstTurnFromStorage = window.localStorage.getItem('firstTurn');
        const symbolFromStorage = window.localStorage.getItem('symbol');
        const otherSymbol = symbolFromStorage == SYMBOL.X ? SYMBOL.O : SYMBOL.X;

        return (
            actualSymbolFromStorage ?? //Turno de partida guardada
            (firstTurnFromStorage == FIRST_TURN.ME ? symbolFromStorage : otherSymbol) //Turno inicial con configuración guardada
            ) ?? SYMBOL.X; //Turno inicial, desde cero. Primera vez en el juego
        // a ?? b => Si a es null o undefined, devuelve b
    });
    
    const [winner, setWinner] = useState(null); // null => sin ganador, false => empate, 'x' u 'o' => ganador
    const [isConfig, setIsConfig] = useState(false);

    const [mode, setMode] = useState(() => {
        const modeFromStorage = window.localStorage.getItem('mode');
        return modeFromStorage ?? MODE.TWO_PLAYERS;
    });

    /**
     * Funciones para el juego
     */

    const resetGame = () => {
        const firstTurnFromStorage = window.localStorage.getItem('firstTurn');
        const symbolFromStorage = window.localStorage.getItem('symbol');
        const opponentSymbol = symbolFromStorage == SYMBOL.X ? SYMBOL.O : SYMBOL.X;
        const modeFromStorage = window.localStorage.getItem('mode');

        const symbolToSet = (modeFromStorage == MODE.VS_IA ? 
                            (firstTurnFromStorage == FIRST_TURN.ME ? symbolFromStorage : opponentSymbol) :
                            symbolFromStorage ) ??  SYMBOL.X;
        
        setBoard(Array(9).fill(null));
        setSymbol(symbolToSet);
        setMode(modeFromStorage);
        setWinner(null);
        setIsConfig(false);

        // Eliminamos los cambios almacenados por que se está reiniciando la partida
        resetGameStorage();

        // Verificar si la IA inicia el juego
        if(modeFromStorage == MODE.VS_IA && firstTurnFromStorage == FIRST_TURN.IA && symbolFromStorage != symbolToSet){
            setTimeout(movementOfIA, 500, Array(9).fill(null), symbolToSet);
            //movementOfIA(Array(9).fill(null), symbolToSet);
        }
    }

    const updateBoard = (index, actualBoard = board, actualSymbol = symbol, fromIA = false) => {

        // Si la posición ya tiene un valor o ya hay un ganador, que no haga nada
        // Nota: Si hay un empate, eso quiere decir que ninguna posición es seleccionable
        // por ello no se coloca explícitamente
        if(actualBoard[index] || (fromIA ? false : winner)) return; // Si la posición ya tiene un valor, que no haga nada

        const newBoard = [...actualBoard]; // Generamos un nuevo arreglo en base al board actual
        newBoard[index] = actualSymbol; // Modificamos la posición elegida
        setBoard(newBoard); // Actualizamos el estado del board

        const newSymbol = actualSymbol == SYMBOL.X ? SYMBOL.O : SYMBOL.X; // Obtenemos el nuevo simbolo
        setSymbol(newSymbol); // Actualizamos el simbolo

        saveGameToStorage({
            board : newBoard,
            actualSymbol  : newSymbol
        });

        const newWinner = checkWinner(newBoard); // Verificamos si hay ganador
        if(newWinner){
            setWinner(newWinner) // Si el ganador existe, actualizamos el estado del ganador
            setTimeout(confetti, 1000); // Efecto de confetti
            //confetti() 
            return;
        } else if(checkEndGame(newBoard)){ // Si el juego acabó en empate, se actualiza el ganador a false
            setWinner(false)
            return;
        }

        const symbolFromStorage = window.localStorage.getItem('symbol');
        if(mode == MODE.VS_IA && newSymbol != symbolFromStorage){
            setTimeout(movementOfIA, 500, newBoard, newSymbol);
            //movementOfIA(newBoard, newSymbol);
        }
    }

    const setConfigParams = ({ newSymbol, newMode }) => {
        setSymbol(newSymbol);
        setMode(newMode);
    }

    /**
     * Funciones para la IA
     */

    const movementOfIA = (actualBoard, actualSymbol) => {
        const opponentSymbol = window.localStorage.getItem('symbol');
        const IaSymbol = opponentSymbol == SYMBOL.X ? SYMBOL.O : SYMBOL.X;

        //Verificar si la IA tiene una jugada ganadora inmediata y la ejecuta
        for (let i = 0; i < 9; i++) {
            if (actualBoard[i] == null) {
                actualBoard[i] = IaSymbol; // Simula el siguiente movimiento
                if (checkWinner(actualBoard)) {
                    actualBoard[i] = null; // Deshace la simulación
                    updateBoard(i, actualBoard, actualSymbol, true); // Ejecuta el movimiento ganador
                    return;
                }
                actualBoard[i] = null; // Deshace la simulación
            }
        }

        // Verifica si el oponente tiene una jugada ganadora inmediata y la bloquea
        for (let i = 0; i < 9; i++) {
            if (actualBoard[i] == null) {
                actualBoard[i] = opponentSymbol; // Simula el movimiento del oponente
                if (checkWinner(actualBoard)) {
                    actualBoard[i] = null; // Deshace la simulación
                    updateBoard(i, actualBoard, actualSymbol, true); // Bloquea la jugada ganadora del oponente
                    return;
                }
                actualBoard[i] = null; // Deshace la simulación
            }
        }

        // Si el oponente tiene su símbolo en 2 esquinas opuestas, ocupar un borde disponible
        if((actualBoard[0] == opponentSymbol && actualBoard[8] == opponentSymbol) ||
            (actualBoard[2] == opponentSymbol && actualBoard[6] == opponentSymbol)){
            const bordesDisponibles = [1, 3, 5, 7];
            bordesDisponibles.sort(() => Math.random() - 0.5);
            for (const index of bordesDisponibles) {
                if (actualBoard[index] == null) {
                    updateBoard(index, actualBoard, actualSymbol, true);
                    return;
                }
            }
        }

        // Si el oponente tiene 2 su símbolo en 1 fila extrema y 1 columna extrema consecutiva, se coloca en medio
        if((actualBoard[0] == opponentSymbol || actualBoard[1] == opponentSymbol) &&
            (actualBoard[5] == opponentSymbol || actualBoard[8] == opponentSymbol) &&
            actualBoard[2] == null){
            updateBoard(2, actualBoard, actualSymbol, true);
            return;
        }
        if((actualBoard[2] == opponentSymbol || actualBoard[5] == opponentSymbol) &&
            (actualBoard[6] == opponentSymbol || actualBoard[7] == opponentSymbol) &&
            actualBoard[8] == null){
            updateBoard(8, actualBoard, actualSymbol, true);
            return;
        }
        if((actualBoard[0] == opponentSymbol || actualBoard[3] == opponentSymbol) &&
            (actualBoard[7] == opponentSymbol || actualBoard[8] == opponentSymbol) &&
            actualBoard[6] == null){
            updateBoard(6, actualBoard, actualSymbol, true);
            return;
        }
        if((actualBoard[1] == opponentSymbol || actualBoard[2] == opponentSymbol) &&
            (actualBoard[3] == opponentSymbol || actualBoard[6] == opponentSymbol) &&
            actualBoard[0] == null){
            updateBoard(0, actualBoard, actualSymbol, true);
            return;
        }

        // Si el oponente no tiene una jugada ganadora inmediata, se sigue con la estrategia normal
        if (actualBoard[4] == null/*  && Math.random() - 0.7 > 0 */) {
            updateBoard(4, actualBoard, actualSymbol, true);
            return;
        } else {
            if(Math.random() - 0.5 > 0){
                const esquinasDisponibles = [0, 2, 6, 8];
                esquinasDisponibles.sort(() => Math.random() - 0.5);
                for (const index of esquinasDisponibles) {
                    if (actualBoard[index] == null) {
                        updateBoard(index, actualBoard, actualSymbol, true);
                        return;
                    }
                }

                const bordesDisponibles = [1, 3, 5, 7];
                bordesDisponibles.sort(() => Math.random() - 0.5);
                for (const index of bordesDisponibles) {
                    if (actualBoard[index] == null) {
                        updateBoard(index, actualBoard, actualSymbol, true);
                        return;
                    }
                }
            }else{
                const bordesDisponibles = [1, 3, 5, 7];
                bordesDisponibles.sort(() => Math.random() - 0.5);
                for (const index of bordesDisponibles) {
                    if (actualBoard[index] == null) {
                        updateBoard(index, actualBoard, actualSymbol, true);
                        return;
                    }
                }

                const esquinasDisponibles = [0, 2, 6, 8];
                esquinasDisponibles.sort(() => Math.random() - 0.5);
                for (const index of esquinasDisponibles) {
                    if (actualBoard[index] == null) {
                        updateBoard(index, actualBoard, actualSymbol, true);
                        return;
                    }
                }
            }
        }
    }

    return (
        <main className='board'>
            <h1>Tic Tac Toe</h1>
            <Menu resetGame={resetGame} setIsConfig={setIsConfig}/>
            <Board board={board} updateBoard={updateBoard} />
            <Turn turn={symbol} />
            <WinnerModal winner={winner} resetGame={resetGame} />
            <ConfigModal isConfig={isConfig} setIsConfig={setIsConfig} resetGame={resetGame} setConfigParams={setConfigParams} />
        </main>
    )
}

export default App
