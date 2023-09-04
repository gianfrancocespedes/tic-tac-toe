import { TURNS } from "../constants"
import { Square } from "./Square"

export function Turn ({ turn }) {
    return (
        <section className="turn">
            <Square isSelected={turn == TURNS.X}>{TURNS.X}</Square>
            <Square isSelected={turn == TURNS.O}>{TURNS.O}</Square>
        </section>
    )
}