export const saveGameToStorage = ({ board, actualSymbol }) => {
    window.localStorage.setItem('board', JSON.stringify(board));
    window.localStorage.setItem('actualSymbol', actualSymbol);
}

export const resetGameStorage = () => {
    window.localStorage.setItem('board',  JSON.stringify(Array(9).fill(null)));
    window.localStorage.removeItem('actualSymbol');
}

export const saveConfigToStorage = ({ symbol, mode, firstTurn }) => {
    window.localStorage.setItem('symbol', symbol);
    window.localStorage.setItem('mode', mode);
    window.localStorage.setItem('firstTurn', firstTurn);
}