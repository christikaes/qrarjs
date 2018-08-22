// The entry file of your WebAssembly module.
@external("env", "poseCalculated")
declare function poseCalculated(
  rotationX: f64, rotationY: f64, rotationZ: f64,
  translationX: f64, translationY: f64, translationZ: f64
): void;

// export function add(a: i32, b: i32): i32 {
//   return a + b;
// }

// import { Posit } from './Posit';
// import { Vec3 } from './Vec3';
// The entry file of your WebAssembly module.
// import { binarize } from "./binarizer";
// import { BitMatrix } from "./BitMatrix";
// import { extract } from "./extractor";
// import { locate, Point } from "./locator";

// export function processQR(imageData: Uint8Array, width: i32, height: i32): BitMatrix {
//   const binarized = binarize(imageData, width, height);
//   return binarized;
// }


// This could be an array:
// const cornersList = [
//   { ...corners.bottomLeft },
//   { ...corners.bottomRight },
//   { ...corners.topRight },
//   { ...corners.topLeft },
// ];

import * as Vec3 from './Vec3';

export function posit(
  bottomLeftX: i32, bottomRightX: i32, bottomRightY: i32

  // bottomLeftX: i32, bottomLeftY: i32,
  // bottomRightX: i32, bottomRightY: i32,
  // topRightX: i32, topRightY: i32,
  // topLeftX: i32, topLeftY: i32,
  // modelSize: i32, focalLength: i32
): void {

  const a: i32[] = [0, 0, 0];
  a[0] = bottomLeftX;
  a[1] = bottomRightX;
  // const b: i32[] = [bottomLeftX, bottomRightX, bottomRightY];

  // let a: i32[] = [2, 4, 5];
  // let b: i32[] = [1, 2, 3];
  // const res = Vec3.sub(a, b);

  const res2 = Vec3.yo(a);

  // const res2: number[] = [
  //   a[0] - b[0],
  //   a[1] - b[1],
  //   a[2] - b[2]
  // ]

  // let a: i32[] = [3, 5];
  // let res = Vec3.add(a[0], a[1]);
  // let res2 = Vec3.add2(a);

  // poseCalculated(res, 0, 0, 0, 0, 0) //res2[0], res2[1], res2[2]);
  // poseCalculated(res[0], res[1], res[2], 0, 0, 0) //res2[0], res2[1], res2[2]);
  poseCalculated(res2[0], res2[1], 0, 0, 0, 0)// res[0], res[1], res[2], 0, 0, 0) //res2[0], res2[1], res2[2]);



  // const binarized = binarize(imageData, width, height);
  // if (imageData.length !== width * height * 4) {
  //     console. Error("Malformed data passed to binarizer.");
  // }
  // return imageData.length;
  // const posit = new Posit(modelSize, focalLength);
  // poseCalculated(vec.v[0], vec.v[1], vec.v[2], topLeftX, topRightX, topLeftY)

}
