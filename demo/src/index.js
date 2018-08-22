import * as THREE from "three";
import MTLLoader from "three-mtl-loader";
import OBJLoader from "three-obj-loader";
import { QrAr3d } from 'qrar';

// import "./qrar.css";

const $ = (selector) => {
    return document.querySelector(selector);
};


OBJLoader(THREE);

// MTLLoader(THREE);
const mtlLoader = new MTLLoader();

mtlLoader.setPath("assets/r2d2/")
mtlLoader.load("r2d2.mtl", (materials) => {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials)
    mtlLoader.setPath("assets/r2d2/")

    objLoader.load("assets/r2d2/r2d2.obj", (object) => {
        QrAr3d($("#qrar"), object, 3);
    });
});
