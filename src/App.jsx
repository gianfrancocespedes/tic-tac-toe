import './App.css'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { TURNS } from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js'
import { saveGameToStorage, resetGameStorage } from './logic/storage.js'

import { Board } from './components/Board.jsx'
import { Turn } from './components/Turn'
import { WinnerModal } from './components/WinnerModal'
import { ConfigModal } from './components/ConfigModal'

function App() {
    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem('board');
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
    });
    const [turn, setTurn] = useState(() => {
        const actualTurnFromStorage = window.localStorage.getItem('simbol');
        const firstTurnFromStorage = window.localStorage.getItem('firstTurn');
        return (actualTurnFromStorage ?? firstTurnFromStorage) ?? TURNS.X; 
        // a ?? b => Si a es null o undefined, devuelve b
    });
    const [winner, setWinner] = useState(null); // null => sin ganador, false => empate, 'x' u 'o' => ganador
    const [isConfig, setIsConfig] = useState(true);

    const resetGame = () => {
        const firstTurnFromStorage = window.localStorage.getItem('simbol');
        const turnToSet = firstTurnFromStorage ?? TURNS.X; 
        setBoard(Array(9).fill(null));
        setTurn(turnToSet);
        setWinner(null);
        setIsConfig(false);

        //Eliminamos los cambios almacenados por que se está reiniciando la partida
        resetGameStorage();
    }

    const updateBoard = (index) => {

        // Si la posición ya tiene un valor o hay un ganador, que no haga nada
        // Nota: Si hay un empate, eso quiere decir que ninguna posición es seleccionable
        // por ello no se coloca explícitamente
        if(board[index] || winner) return; // Si la posición ya tiene un valor, que no haga nada
        
        const newBoard = [...board]; // Generamos un nuevo arreglo en base al board actual
        newBoard[index] = turn; // Modificamos la posición elegida
        setBoard(newBoard); // Actualizamos el estado del board

        const newTurn = turn == TURNS.X ? TURNS.O : TURNS.X; // Obtenemos el nuevo estado
        setTurn(newTurn); // Actualizamos el estado del turno

        saveGameToStorage({
            board : newBoard,
            turn  : newTurn
        });

        const newWinner = checkWinner(newBoard); // Verificamos si hay ganador
        if(newWinner){
            setWinner(newWinner) // Si el ganador existe, actualizamos el estado del ganador
            confetti() // Efecto de confetti
        } else if(checkEndGame(newBoard)){ // Verificamos si el juego acabó en empate
            setWinner(false)
        } 
    }

    return (
        <main className='board'>
            <h1>Tic Tac Toe</h1>
            <button onClick={resetGame}>Reiniciar</button>
            <Board board={board} updateBoard={updateBoard}></Board>
            <Turn turn={turn}></Turn>
            <WinnerModal winner={winner} resetGame={resetGame}></WinnerModal>
            <ConfigModal isConfig={isConfig} setIsConfig={setIsConfig} resetGame={resetGame}></ConfigModal>
        </main>
    )
}

export default App
