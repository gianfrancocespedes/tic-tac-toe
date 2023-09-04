import { WINNER_COMBOS } from "../constants";

export const checkWinner = (boardToCheck) => {
    for(const combo of WINNER_COMBOS){
        const [a, b, c] = combo;
        if( boardToCheck[a] && 
            boardToCheck[a]==boardToCheck[b] && 
            boardToCheck[a]==boardToCheck[c]){
            return boardToCheck[a]; //Se retorna al ganador
        }
    }
    return null; //Se retorna null => sin ganador
}

export const checkEndGame = (newBoard) => {
    // Verificamos que cada elemento del tablero sea diferente de null
    // para validar que terminó el juego
    return newBoard.every((elem) => elem != null)
}