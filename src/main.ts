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
