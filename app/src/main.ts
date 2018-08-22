import * as THREE from "three";
import * as MTLLoader from "three-mtl-loader";
import * as OBJLoader from "three-obj-loader";
import { QrAr } from "./lib/QrAr";

import "./qrar.css";

const $ = (selector) => {
    return document.querySelector(selector);
};

// const mtlLoader = new MTLLoader();
// mtlLoader
//    .load("assets/r2-d2.mtl", (materials) => {
//        materials.preload();
OBJLoader(THREE); // Thanks OBJLoader, this maketh no senth
const objLoader = new THREE.OBJLoader();
objLoader
    // .setMaterials(materials);

    .load("assets/r2-d2.obj", (object) => {
        // .load("assets/pyramid.obj", (object) => {
        // object.position.y = - 95;
        const myQrAr = new QrAr($("#qrar"), object);
    });
//    });

// const myQrAr = new QrAr($("#qrar"), pass in thinggy here (obj));

// ----------------------------------------
// WASM

// IF Worker is supported:
// import * as Worker from "./worker.js";

// const worker = new Worker();
// worker.postMessage(1);
// worker.onmessage = (event) => {
//     console.log("mainthread got:", event.data);
// };

// Otherwise, just use wasm on main thread
// declare var WebAssembly: any; // ADDED
// WebAssembly.instantiateStreaming(fetch("optimized.wasm"))
//     .then((results) => {
//         console.log(results.instance.exports.add(12, 1));

//     });
