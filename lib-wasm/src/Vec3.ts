
export class Vec3 {

    // public static sub(A: Vec3, B: Vec3): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;
    //     const b = B.v;

    //     v[0] = a[0] - b[0];
    //     v[1] = a[1] - b[1];
    //     v[2] = a[2] - b[2];

    //     return vector;
    // }

    // public static inverse(A: Vec3): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;

    //     if (a[0] !== 0.0) {
    //         v[0] = 1.0 / a[0];
    //     }
    //     if (a[1] !== 0.0) {
    //         v[1] = 1.0 / a[1];
    //     }
    //     if (a[2] !== 0.0) {
    //         v[2] = 1.0 / a[2];
    //     }

    //     return vector;
    // }

    // public static addScalar(A: Vec3, b: number): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;

    //     v[0] = a[0] + b;
    //     v[1] = a[1] + b;
    //     v[2] = a[2] + b;

    //     return vector;
    // }

    // public static mult(A: Vec3, B: Vec3): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;
    //     const b = B.v;

    //     v[0] = a[0] * b[0];
    //     v[1] = a[1] * b[1];
    //     v[2] = a[2] * b[2];

    //     return vector;
    // }

    // public static dot(A: Vec3, B: Vec3): number {
    //     const a = A.v;
    //     const b = B.v;

    //     return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    // }

    // public static multScalar(A: Vec3, b: number): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;

    //     v[0] = a[0] * b;
    //     v[1] = a[1] * b;
    //     v[2] = a[2] * b;

    //     return vector;
    // }

    // public static add(A: Vec3, B: Vec3): Vec3 {
    //     const vector = new Vec3(0.0, 0.0, 0.0);
    //     const v = vector.v;

    //     const a = A.v;
    //     const b = B.v;

    //     v[0] = a[0] + b[0];
    //     v[1] = a[1] + b[1];
    //     v[2] = a[2] + b[2];

    //     return vector;
    // }

    // public static cross(A: Vec3, B: Vec3): Vec3 {
    //     const a = A.v;
    //     const b = B.v;

    //     return new Vec3(
    //         a[1] * b[2] - a[2] * b[1],
    //         a[2] * b[0] - a[0] * b[2],
    //         a[0] * b[1] - a[1] * b[0]);
    // }

    public v: number[];

    constructor(x: number, y: number, z: number) {
        this.v = [x, y, z];
    }

    // public copy(A: Vec3): Vec3 {
    //     const v = this.v;

    //     const a = A.v;

    //     v[0] = a[0];
    //     v[1] = a[1];
    //     v[2] = a[2];

    //     return this;
    // }

    // public normalize(): number {
    //     const v = this.v;
    //     const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);

    //     if (len > 0.0) {
    //         v[0] /= len;
    //         v[1] /= len;
    //         v[2] /= len;
    //     }

    //     return len;
    // }

    // public square(): number {
    //     const v = this.v;

    //     return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    // }

    // public minIndex(): number {
    //     const v = this.v;

    //     return v[0] < v[1] ? (v[0] < v[2] ? 0 : 2) : (v[1] < v[2] ? 1 : 2);
    // }
}
