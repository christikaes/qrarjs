import Vec3 from "./Vec3";

export default class Mat3 {

    // Creates a new Mat3 from the given rows
    public static fromRows(A: Vec3, B: Vec3, C: Vec3): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        const a = A.v;
        const b = B.v;
        const c = C.v;

        m[0][0] = a[0];
        m[0][1] = a[1];
        m[0][2] = a[2];
        m[1][0] = b[0];
        m[1][1] = b[1];
        m[1][2] = b[2];
        m[2][0] = c[0];
        m[2][1] = c[1];
        m[2][2] = c[2];

        return matrix;
    }

    // Multiples two matrices
    public static mult(A: Mat3, B: Mat3): Mat3 {
        const M = new Mat3();
        const m = M.m;

        const a = A.m;
        const b = B.m;

        m[0][0] = a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0];
        m[0][1] = a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1];
        m[0][2] = a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2];
        m[1][0] = a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0];
        m[1][1] = a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1];
        m[1][2] = a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2];
        m[2][0] = a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0];
        m[2][1] = a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1];
        m[2][2] = a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2];

        return M;
    }

    // Returns a new clone of the passed in matrix
    public static clone(A: Mat3): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        const a = A.m;

        m[0][0] = a[0][0];
        m[0][1] = a[0][1];
        m[0][2] = a[0][2];
        m[1][0] = a[1][0];
        m[1][1] = a[1][1];
        m[1][2] = a[1][2];
        m[2][0] = a[2][0];
        m[2][1] = a[2][1];
        m[2][2] = a[2][2];

        return matrix;
    }

    // Creates a matrix from a diagonal vector
    public static fromDiagonal(A: Vec3) {
        const matrix = new Mat3();
        const m = matrix.m;

        const a = A.v;

        m[0][0] = a[0];
        m[1][1] = a[1];
        m[2][2] = a[2];

        return matrix;
    }

    // Transposes a matrix
    public static transpose(A: Mat3): Mat3 {
        const matrix = new Mat3();
        const m = matrix.m;

        const a = A.m;

        m[0][0] = a[0][0];
        m[0][1] = a[1][0];
        m[0][2] = a[2][0];
        m[1][0] = a[0][1];
        m[1][1] = a[1][1];
        m[1][2] = a[2][1];
        m[2][0] = a[0][2];
        m[2][1] = a[1][2];
        m[2][2] = a[2][2];

        return matrix;
    }

    // Multiplies two vectors
    public static multVector(M: Mat3, A: Vec3): Vec3 {
        const m = M.m;
        const a = A.v;

        return new Vec3(
            m[0][0] * a[0] + m[0][1] * a[1] + m[0][2] * a[2],
            m[1][0] * a[0] + m[1][1] * a[1] + m[1][2] * a[2],
            m[2][0] * a[0] + m[2][1] * a[1] + m[2][2] * a[2]);
    }

    public m: [
        [number, number, number],
        [number, number, number],
        [number, number, number]
    ];

    constructor() {
        this.m = [
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 0.0],
        ];
    }

    // Copies values from the passed in matrix to this
    public copy(A: Mat3): Mat3 {
        const m = this.m;

        const a = A.m;

        m[0][0] = a[0][0];
        m[0][1] = a[0][1];
        m[0][2] = a[0][2];
        m[1][0] = a[1][0];
        m[1][1] = a[1][1];
        m[1][2] = a[1][2];
        m[2][0] = a[2][0];
        m[2][1] = a[2][1];
        m[2][2] = a[2][2];

        return this;
    }

    // Gets the column based on an index
    public column(index: number): Vec3 {
        const m = this.m;

        return new Vec3(m[0][index], m[1][index], m[2][index]);
    }

    // Gets the row based on index
    public row(index: number): Vec3 {
        const m = this.m;

        return new Vec3(m[index][0], m[index][1], m[index][2]);
    }
}
