export const saveGameToStorage = ({ board, actualTurn }) => {
    window.localStorage.setItem('board', JSON.stringify(board));
    window.localStorage.setItem('actualTurn', actualTurn);
}

export const resetGameStorage = () => {
    window.localStorage.removeItem('board');
    window.localStorage.removeItem('actualTurn');
}

export const saveConfigToStorage = ({ simbol, mode, firstTurn }) => {
    window.localStorage.setItem('simbol', simbol);
    window.localStorage.setItem('mode', mode);
    window.localStorage.setItem('firstTurn', firstTurn);
}