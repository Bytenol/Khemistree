const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);


const permutator = (inputArr: any[]) => {
    let result: Array<any[]> = [];
    const permute = (arr: any[], m: any[] = []) => {
        if (arr.length === 0) {
            result.push(m)
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }
    permute(inputArr)
    return result;
}


const vector = (() => {

    /**
     * Multiply a vector by a scalar number
     * @param s is the scaling factor
     * @param v is the vector
     * @returns {*[]}
     */
    const multiplyScalar = (s: number, v: vector_t<number>) => {
        let res = [];
        for(let i = 0; i < v.length; i++) res.push(s * v[i]);
        return res;
    };

    const subtract = (v1: vector_t<number>, v2: vector_t<number>) => {
        let res = [];
        for(let i = 0; i < v1.length; i++) res.push(v1[i] - v2[i]);
        return res;
    }

    return { multiplyScalar, subtract };

})();


/***
 * This function uses augmented matrix to perform some series of operations
 * @param m is the matrix
 * @param coeff is the rightmost column of the matrix
 * @type {function(*, *): {reduceEchelon: function(): {aug: [], matrix: *, coeff: *}, toString: function(): string}}
 */
const matrix = ((m: matrix_t<number>, coeff: vector_t<number>) => {

    let rowLength = m.length;
    let columnLength = m[0].length;
    const fracCoeff: vector_t<Fraction> = [];

    const getTriangleLoc = (columnNo: number) => {
        const upper: vector_t<iGrid<number>> = [];
        const lower: vector_t<iGrid<number>> = [];

        for(let j = 0; j < 2; j++) {
            const startPt = j === 0 ? columnNo + 1 : 0;
            const endPt = j === 0 ? rowLength : columnNo;
            const cont = j === 0 ? lower : upper;
            for(let k = startPt; k < endPt; k++) {
                const val = m[k][columnNo];
                if( val !== 0) cont.push({ row: k, col: columnNo, val});
            }
        }

        return { upper: upper.reverse(), lower };
    };


    const resolveRow = () => {
        const indices = new Array(m.length).fill(0).map((i, j) => i += j);

        let isSolved = true;
        const perms = permutator(indices);

        for(let i = 0; i < perms.length; i++) {
            isSolved = true;
            const perm = perms[i];
            let d: matrix_t<number> = [];
            perm.forEach(p => d.push( m[p]) );
            for(let i = 0; i < d.length; i++) {
                const g = d[i][i];
                if(g === 0) {
                    isSolved = false;
                    break;
                }
            }

            if(isSolved) {
                let cCoeff = [...coeff];
                perm.forEach((p, i) => {
                    coeff[i] = cCoeff[p];
                });
                m = d;
                break;
            }
        }

        if(!isSolved) throw new Error("Diagonal not valid");
    };


    const toString = () => {
        let str = "";
        for(let i = 0; i < m.length; i++) {
            for(let j = 0; j < m[i].length; j++) str += " " + m[i][j] + " ";
            str += "| " + Fraction.fromDecimal(coeff[i]).toString();
            str += "\n";
        }
        return str;
    }


    const reduceEchelon = () => {

        for(let i = 0; i < columnLength; i++) {

            // rearrange row to resolve zero
            for(let i = 0; i < columnLength; i++) {
                if(!m[i]) {
                    console.log("A Fatal error has occured");
                    return;
                }
                const g = m[i][i];
                if(g === 0) resolveRow();
            }

            const {lower, upper} = getTriangleLoc(i);
            const iterable = [...lower, ...upper];

            for(let j = 0; j < iterable.length; j++) {
                const data = iterable[j];
                const pivotMatrix = [...m[data.col], coeff[data.col]];
                const itemMatrix = [...m[data.row], coeff[data.row]];
                const m1 = vector.multiplyScalar(itemMatrix[data.col], pivotMatrix);
                const m2 = vector.multiplyScalar(pivotMatrix[data.col], itemMatrix);
                const nm = vector.subtract(m1, m2);
                coeff[data.row] = nm.splice(columnLength, 1)[0];
                m[data.row] = nm;
            }
        }

        // reduction to echelon form
        for(let i = 0; i < columnLength; i++) {
            const v = m[i][i];
            const inf = 1 / v;
            m[i] = vector.multiplyScalar(inf, m[i]);
            fracCoeff[i] = new Fraction(coeff[i], v);
            coeff[i] *= inf;
        }

        return { matrix: m, coeff, fracCoeff };
    };


    return { reduceEchelon, toString };

});


class Fraction {

    constructor(public num: number = 1, public denom: number = 1) {
        this.simplify();
    }

    simplify() {
        let _gcd = gcd(this.num, this.denom);
        while (Math.abs(_gcd) !== 1) {
            this.num /= _gcd;
            this.denom /= _gcd;
            _gcd = gcd(this.num, this.denom);
        }
    }

    multiply(f: Fraction) {
        return new Fraction(this.num * f.num, this.denom * f.denom);
    }

    asFloat(): number { return this.num / this.denom; }

    isInteger(): boolean { return Math.abs(this.denom) === 1; }

    toString(): string { return `${this.num}/${this.denom}`; }

    static fromDecimal(n: number) {
        if(!(String(n).includes("."))) return new Fraction(n, 1);
        const ns = 10 ** String(n).split(".")[1].length;
        return new Fraction(n * ns, ns);
    }

}

export {
    gcd,
    vector,
    matrix,
    Fraction
}