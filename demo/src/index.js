import { QrAr3d } from 'qrar';
const THREE = window.THREE;

// import "./qrar.css";

const $ = (selector) => {
    return document.querySelector(selector);
};

const mtlLoader = new THREE.MTLLoader();

mtlLoader.setPath("assets/r2d2/")
mtlLoader.load("r2d2.mtl", (materials) => {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials)
    mtlLoader.setPath("assets/r2d2/")
    // objLoader.load("assets/r2d2/r2d2.obj", (object) => {
    //     QrAr3d(THREE, $("#qrar"), object, 3);
    // });

    objLoader.load("assets/r2-d2.obj", (object) => {
        QrAr3d(THREE, $("#qrar"), object);
    });
});
