import { Square } from "./Square"

export function Board ({ board, updateBoard }) {
    return (
        <section className='game'>
            {
                board.map((elem, index) => {
                    return(
                        <Square key={index} index={index} updateBoard={updateBoard}>
                            {elem}
                        </Square>
                    )
                })
            }
        </section>
    )
}