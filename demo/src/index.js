import { QrAr3d, QrAr2d } from 'qrar';
const THREE = window.THREE;

const $ = (selector) => {
    return document.querySelector(selector);
};

// Example of using a THREEjs model with QrAr3d
const mtlLoader = new THREE.MTLLoader();
const objLoader = new THREE.OBJLoader();
mtlLoader.setPath("assets/r2d2/")
mtlLoader.load("r2d2.mtl", (materials) => {
    materials.preload();
    objLoader.setMaterials(materials)
    objLoader.load("assets/r2d2/r2d2.obj", (object) => {
        QrAr3d(THREE, $("#qrar3d"), 100, object, 50);
    });
});

// Example of using a panel element with QrAr3d
QrAr2d($("#qrar2d"), 100, $("#panel"));