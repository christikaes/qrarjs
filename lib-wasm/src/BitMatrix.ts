// Copyright: https://github.com/cozmo/jsQR/blob/master/src/BitMatrix.ts
/* tslint:disable */

export class BitMatrix {
    public static createEmpty(width: i32, height: i32): BitMatrix {
        return new BitMatrix(new Uint8Array(width * height), width);
    }

    public width: i32;
    public height: i32;
    private data: Uint8Array;

    constructor(data: Uint8Array, width: i32) {
        this.width = width;
        this.height = data.length / width;
        this.data = data;
    }

    public get(x: i32, y: i32): boolean {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return !!this.data[y * this.width + x];
    }

    public set(x: i32, y: i32, v: boolean): void {
        this.data[y * this.width + x] = v ? 1 : 0;
    }

    public setRegion(left: i32, top: i32, width: i32, height: i32, v: boolean): void {
        for (let y = top; y < top + height; y++) {
            for (let x = left; x < left + width; x++) {
                this.set(x, y, !!v);
            }
        }
    }

    public getInverted(): BitMatrix {
        // TODO optimization, bitmatrix should be bools
        return new BitMatrix(this.data.map((d: i32): i32 => d === 0 ? 1 : 0), this.width);
    }
}
