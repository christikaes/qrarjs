import { Posit } from "./Posit";

const validatePose = (rotation, translation) => {
    const hasNaN = isNaN(rotation.x) || isNaN(rotation.y) || isNaN(rotation.z) ||
        isNaN(translation.x) || isNaN(translation.y) || isNaN(translation.z);

    const invalidRotation = Math.abs(rotation.x) < Math.PI / 2;

    return !hasNaN && !invalidRotation;
}

export function estimatePose(
    corners: { bottomLeft: { x, y }, bottomRight: { x, y }, topRight: { x, y }, topLeft: { x, y } },
    width: number,
    height: number,
    markerSize: number // in mm
) {

    // ORDER IS IMPORTANT
    const cornersList = [
        { ...corners.bottomLeft },
        { ...corners.bottomRight },
        { ...corners.topRight },
        { ...corners.topLeft },
    ];

    // // Average the corners so that we get less jitter
    // const avgCorners = this.averageCorners(cornersList);

    // const range = this.calculateRangeOfAverageCornerDistance(this.previousCorners);
    // // if the range is is too large, then early exist
    // const rangeThreshold = 5;
    // if (range > rangeThreshold) {
    //     return;
    // }

    // Corners have to be relative to canvas center
    for (const corner of cornersList) {
        corner.x = corner.x - (width / 2);
        corner.y = (height / 2) - corner.y;
    }

    // Get a new Pose (estimation) from the corners
    const posit = new Posit(markerSize, width);
    const pose = posit.pose(cornersList);

    // Get the rotation/translation of the model from the pose
    if (pose.isError()) {
        return;
    }
    const rotation = pose.getRotation();
    const translation = pose.getTranslation();

    // Validate Pose
    const poseValid = validatePose(rotation, translation);
    if (!poseValid) {
        return;
    }

    return { rotation, translation };
}



//     // IF Worker is supported:
//     // import * as Worker from "./worker.js";

//     // const worker = new Worker();
//     // worker.postMessage(1);
//     // worker.onmessage = (event) => {
//     //     console.log("mainthread got:", event.data);
//     // };

//     // Otherwise, just use wasm on main thread

//     const importObject = {
//         env: {
//             memory: new WebAssembly.Memory({ initial: 10 }),
//             memoryBase: 500,
//             // table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
//             // tableBase: 0,
//             abort: (why) => { console.log("ABORT"); console.log(why); },
//             poseCalculated: (
//                 rotationX: number, rotationY: number, rotationZ: number,
//                 translationX: number, translationY: number, translationZ: number) => {
//                 console.log({
//                     rotationX, rotationY, rotationZ,
//                     translationX, translationY, translationZ,
//                 });
//             },
//         },
//     };

//     WebAssembly.instantiateStreaming(fetch("untouched.wasm"), importObject)
//         .then((module) => {
//             this.lib = module.instance.exports;
//         });
// }
