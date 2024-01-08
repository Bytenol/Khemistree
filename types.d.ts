type vector_t<T> = Array<T>

type matrix_t<T> = Array<vector_t<T>>

interface iAtom {
    symb: string,
    count: number | string,
    charge: number | string
}

interface iGrid<T> {
    row: number,
    col: number,
    val?: T
}