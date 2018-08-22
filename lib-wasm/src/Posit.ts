/*
Copyright (c) 2012 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "3D Pose Estimation"
  Andrew Kirillow
  http://www.aforgenet.com/articles/posit/
*/

import { Mat3 } from "./Mat3";
import { Pose } from "./Pose";
import { SVD } from "./SVD";
import { Vec3 } from "./Vec3";

interface Point { x: i32, y: i32 };

// Order matters
type Points = [Point, Point, Point, Point]

export class Posit {
    private modelVectors: Mat3;
    private model: [Vec3, Vec3, Vec3, Vec3];
    private modelPseudoInverse: Mat3;
    private modelNormal: Vec3;
    private focalLength: i32;

    constructor(modelSize: i32, focalLength: i32) {
        this.model = this.buildModel(modelSize);
        this.focalLength = focalLength;

        this.init();
    }

    public pose(points: [{ x: i32, y: i32 }, { x: i32, y: i32 }, { x: i32, y: i32 }, { x: i32, y: i32 }]) {
        const eps = new Vec3(1.0, 1.0, 1.0);
        const rotation1 = new Mat3();
        const rotation2 = new Mat3();
        const translation1 = new Vec3();
        const translation2 = new Vec3();

        this.pos(points, eps, rotation1, rotation2, translation1, translation2);

        const error1 = this.iterate(points, rotation1, translation1);
        const error2 = this.iterate(points, rotation2, translation2);

        return error1 < error2 ?
            new Pose(error1, rotation1.m, translation1.v, error2, rotation2.m, translation2.v) :
            new Pose(error2, rotation2.m, translation2.v, error1, rotation1.m, translation1.v);
    }

    private init() {
        const d = new Vec3();
        const v = new Mat3();
        let u;

        this.modelVectors = Mat3.fromRows(
            Vec3.sub(this.model[1], this.model[0]),
            Vec3.sub(this.model[2], this.model[0]),
            Vec3.sub(this.model[3], this.model[0]));

        u = Mat3.clone(this.modelVectors);

        SVD.svdcmp(u.m, 3, 3, d.v, v.m);

        this.modelPseudoInverse = Mat3.mult(
            Mat3.mult(v, Mat3.fromDiagonal(Vec3.inverse(d))), Mat3.transpose(u));

        this.modelNormal = v.column(d.minIndex());

    }

    private buildModel(modelSize: i32): [Vec3, Vec3, Vec3, Vec3] {
        const half = modelSize / 2.0;

        return [
            new Vec3(-half, half, 0.0),
            new Vec3(half, half, 0.0),
            new Vec3(half, -half, 0.0),
            new Vec3(-half, -half, 0.0)];
    }

    private pos(points: Points, eps: Vec3, rotation1: Mat3, rotation2: Mat3, translation1: Vec3, translation2: Vec3) {
        const xi = new Vec3(points[1].x, points[2].x, points[3].x);
        const yi = new Vec3(points[1].y, points[2].y, points[3].y);
        const xs = Vec3.addScalar(Vec3.mult(xi, eps), -points[0].x);
        const ys = Vec3.addScalar(Vec3.mult(yi, eps), -points[0].y);
        const i0 = Mat3.multVector(this.modelPseudoInverse, xs);
        const j0 = Mat3.multVector(this.modelPseudoInverse, ys);
        const s = j0.square() - i0.square();
        const ij = Vec3.dot(i0, j0);
        let r = 0.0;
        let theta = 0.0;

        if (0.0 === s) {
            r = Math.sqrt(Math.abs(2.0 * ij));
            theta = (-Math.PI / 2.0) * (ij < 0.0 ? -1 : (ij > 0.0 ? 1.0 : 0.0));
        } else {
            r = Math.sqrt(Math.sqrt(s * s + 4.0 * ij * ij));
            theta = Math.atan(-2.0 * ij / s);
            if (s < 0.0) {
                theta += Math.PI;
            }
            theta /= 2.0;
        }

        const lambda = r * Math.cos(theta);
        const mu = r * Math.sin(theta);

        // console.table({
        //     theta,
        //     lambda,
        //     mu,
        // });

        // First possible rotation/translation
        let i = Vec3.add(i0, Vec3.multScalar(this.modelNormal, lambda));
        let j = Vec3.add(j0, Vec3.multScalar(this.modelNormal, mu));
        let inorm = i.normalize();
        let jnorm = j.normalize();
        let k = Vec3.cross(i, j);
        rotation1.copy(Mat3.fromRows(i, j, k));

        let scale = (inorm + jnorm) / 2.0;
        let temp = Mat3.multVector(rotation1, this.model[0]);
        translation1.v = [
            points[0].x / scale - temp.v[0],
            points[0].y / scale - temp.v[1],
            this.focalLength / scale];

        // Second possible rotation/translation
        i = Vec3.sub(i0, Vec3.multScalar(this.modelNormal, lambda));
        j = Vec3.sub(j0, Vec3.multScalar(this.modelNormal, mu));
        inorm = i.normalize();
        jnorm = j.normalize();
        k = Vec3.cross(i, j);
        rotation2.copy(Mat3.fromRows(i, j, k));

        scale = (inorm + jnorm) / 2.0;
        temp = Mat3.multVector(rotation2, this.model[0]);
        translation2.v = [
            points[0].x / scale - temp.v[0],
            points[0].y / scale - temp.v[1],
            this.focalLength / scale];
    }

    private iterate(points: Points, rotation: Mat3, translation: Vec3) {
        let prevError = Infinity;
        const rotation1 = new Mat3();
        const rotation2 = new Mat3();
        const translation1 = new Vec3();
        const translation2 = new Vec3();

        let error;

        for (let i = 0; i < 100; ++i) {
            const eps = Vec3.addScalar(Vec3.multScalar(
                Mat3.multVector(this.modelVectors, rotation.row(2)), 1.0 / translation.v[2]), 1.0);

            this.pos(points, eps, rotation1, rotation2, translation1, translation2);

            const error1 = this.getError(points, rotation1, translation1);
            const error2 = this.getError(points, rotation2, translation2);

            if (error1 < error2) {
                rotation.copy(rotation1);
                translation.copy(translation1);
                error = error1;
            } else {
                rotation.copy(rotation2);
                translation.copy(translation2);
                error = error2;
            }

            if ((error <= 2.0) || (error > prevError)) {
                break;
            }

            prevError = error;
        }

        return error;
    }

    private getError(points: Points, rotation: Mat3, translation: Vec3) {
        const v1 = Vec3.add(Mat3.multVector(rotation, this.model[0]), translation).v;
        const v2 = Vec3.add(Mat3.multVector(rotation, this.model[1]), translation).v;
        const v3 = Vec3.add(Mat3.multVector(rotation, this.model[2]), translation).v;
        const v4 = Vec3.add(Mat3.multVector(rotation, this.model[3]), translation).v;

        v1[0] *= this.focalLength / v1[2];
        v1[1] *= this.focalLength / v1[2];
        v2[0] *= this.focalLength / v2[2];
        v2[1] *= this.focalLength / v2[2];
        v3[0] *= this.focalLength / v3[2];
        v3[1] *= this.focalLength / v3[2];
        v4[0] *= this.focalLength / v4[2];
        v4[1] *= this.focalLength / v4[2];

        const modeled = [
            { x: v1[0], y: v1[1] },
            { x: v2[0], y: v2[1] },
            { x: v3[0], y: v3[1] },
            { x: v4[0], y: v4[1] },
        ];

        const ia1 = this.angle(points[0], points[1], points[3]);
        const ia2 = this.angle(points[1], points[2], points[0]);
        const ia3 = this.angle(points[2], points[3], points[1]);
        const ia4 = this.angle(points[3], points[0], points[2]);

        const ma1 = this.angle(modeled[0], modeled[1], modeled[3]);
        const ma2 = this.angle(modeled[1], modeled[2], modeled[0]);
        const ma3 = this.angle(modeled[2], modeled[3], modeled[1]);
        const ma4 = this.angle(modeled[3], modeled[0], modeled[2]);

        return (Math.abs(ia1 - ma1) +
            Math.abs(ia2 - ma2) +
            Math.abs(ia3 - ma3) +
            Math.abs(ia4 - ma4)) / 4.0;
    }

    private angle(a: Point, b: Point, c: Point) {
        const x1 = b.x - a.x;
        const y1 = b.y - a.y;
        const x2 = c.x - a.x;
        const y2 = c.y - a.y;

        return Math.acos((x1 * x2 + y1 * y2) /
            (Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2))) * 180.0 / Math.PI;
    }

}
