import { SYMBOL } from "../constants"
import { Square } from "./Square"

export function Turn ({ turn }) {
    return (
        <section className="turn">
            <Square isSelected={turn == SYMBOL.X}>{SYMBOL.X}</Square>
            <Square isSelected={turn == SYMBOL.O}>{SYMBOL.O}</Square>
        </section>
    )
}