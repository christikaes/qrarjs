import * as THREE from "three";
import { Posit } from "./Posit";

export class QrArView3d {
    private renderer;
    private camera;
    private scene;
    private previousCorners = [];

    constructor(
        private root: HTMLElement,
        private height: number,
        private width: number,
        private model?: THREE.Mesh,
        private modelSize?: number,
    ) {
        if (!model) {
            // tslint:disable-next-line:no-console
            console.warn("No model provided, creating demo box");
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshNormalMaterial({
                opacity: 0.5,
                side: THREE.DoubleSide,
                transparent: true,
            });
            model = new THREE.Mesh(geometry, material);
        }
        this.model = model;

        if (!modelSize) {
            // tslint:disable-next-line:no-console
            console.warn("No modelSize provided, using 50mm");
            modelSize = 100;
        }
        this.modelSize = modelSize;

        this.setup();
    }

    public render(corners) {
        if (!this.renderer || !this.model || !this.modelSize) {
            return;
        }

        // ORDER IS IMPORTANT
        const cornersList = [
            { ...corners.bottomLeft },
            { ...corners.bottomRight },
            { ...corners.topRight },
            { ...corners.topLeft },
        ];

        // TODO-Binam
        // Average the corners so that we get less jitter
        const avgCorners = this.averageCorners(cornersList);

        // Debug:
        const topLeft = document.getElementById("topLeft2");
        topLeft.style.top = avgCorners[3].y + "px";
        topLeft.style.left = avgCorners[3].x + "px";

        const topRight = document.getElementById("topRight2");
        topRight.style.top = avgCorners[2].y + "px";
        topRight.style.left = avgCorners[2].x + "px";

        const bottomLeft = document.getElementById("bottomLeft2");
        bottomLeft.style.top = avgCorners[0].y + "px";
        bottomLeft.style.left = avgCorners[0].x + "px";

        const bottomRight = document.getElementById("bottomRight2");
        bottomRight.style.top = avgCorners[1].y + "px";
        bottomRight.style.left = avgCorners[1].x + "px";

        // Corners have to be relative to canvas center
        for (const corner of avgCorners) {
            corner.x = corner.x - (this.width / 2);
            corner.y = (this.height / 2) - corner.y;
        }

        // Get the rotation/translation of the model based on the corners
        // TODO-Binam - focalLegnth?
        const posit = new Posit(this.modelSize, this.width);
        const pose = posit.pose(avgCorners);

        // Update model
        const rotation = pose.getRotation();
        this.model.rotation.x = rotation.x;
        this.model.rotation.y = rotation.y;
        this.model.rotation.z = rotation.z;

        const position = pose.getPosition();
        this.model.position.x = position.x;
        this.model.position.y = position.y;
        this.model.position.z = position.z;

        this.model.scale.x = this.modelSize;
        this.model.scale.y = this.modelSize;
        this.model.scale.z = this.modelSize;

        this.renderer.render(this.scene, this.camera);
    }

    private setup() {
        // Create renderer

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.root.appendChild(this.renderer.domElement);

        // Create scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 1, 1000);
        this.scene.add(this.camera);

        // Add model
        this.scene.add(this.model);

        // Add lights
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);
        const ambient = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambient);

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    private averageCorners(corners) {
        // TODO-Binam
        // If new one points are more than THRESHOLD distance away from previous then skip

        if (this.previousCorners.length > 4) {
            this.previousCorners.shift();
        }

        this.previousCorners.push(corners);

        const sumCorners = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
        this.previousCorners.forEach((cs) => {
            cs.forEach((c, i) => {
                sumCorners[i].x += c.x;
                sumCorners[i].y += c.y;
            });
        });
        const avgCorners = sumCorners.map((c) => {
            return {
                x: c.x / this.previousCorners.length,
                y: c.y / this.previousCorners.length,
            };
        });

        return avgCorners;
    }

}
