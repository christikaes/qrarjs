import * as THREE from "three";
import { binarize } from "./binarizer";
import { extract } from "./extractor";
import { locate, Point } from "./locator";
import { Posit } from "./Posit";

// QrAr.js
// This class takes in an HTMLElement as the root and creates a QrAr in it
export class QrAr {

    private root: HTMLElement;
    private height: number;
    private width: number;
    private model: THREE.Mesh;
    private modelSize: number;
    private renderer;
    private camera;
    private scene;
    private previousCorners = [];

    constructor(root: HTMLElement, model?: THREE.Mesh, modelSize?: number) {
        if (!root) {
            throw new Error("Must pass in a valid HTMLElement to QrAr");
        }
        this.root = root;

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

    private async setup() {
        const video = await this.setupVideo();
        await this.start(video);
        this.setup3d();
    }

    private async setupVideo() {
        const video = document.createElement("video");
        this.root.appendChild(video);

        // Use facingMode: environment to attemt to get the front camera on phones
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
            },
        });
        video.srcObject = stream;
        video.setAttribute("playsinline", "true"); // required to tell iOS safari we don't want fullscreen
        video.play();

        return video;
    }

    private start(video: HTMLVideoElement): Promise<{}> {
        let videoReady;
        const started = new Promise((resolve) => {
            videoReady = resolve;
        });
        const hiddenCanvas = document.createElement("canvas");
        const hiddenCanvasCtx = hiddenCanvas.getContext("2d");

        const tick = () => {
            // Show loading video message
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                // Hide loading video message

                // Set the video width one time
                if (!this.width) {
                    this.width = video.videoWidth;
                    this.height = video.videoHeight;
                    videoReady();
                }

                // Get ImageData from current video frame
                hiddenCanvas.height = this.height;
                hiddenCanvas.width = this.width;
                hiddenCanvasCtx.drawImage(video, 0, 0, this.width, this.height);

                const imageData = hiddenCanvasCtx.getImageData(0, 0, this.width, this.height);

                // Binarize the ImageData
                const binarized = binarize(imageData.data, this.width, this.height);
                // console.log(binarized);

                // Locate the QR Code
                let location = locate(binarized);
                if (!location) {
                    location = locate(binarized.getInverted());
                }

                // console.log(location);

                if (!location) {
                    // console.log("No Location");
                    requestAnimationFrame(tick);
                    return;
                }

                // Extract so that we can get the position of bottomRight
                const extracted = extract(binarized, location);

                let corners = {
                    bottomLeft: extracted.mappingFunction(0, location.dimension),
                    bottomRight: extracted.mappingFunction(location.dimension, location.dimension),
                    topLeft: extracted.mappingFunction(0, 0),
                    topRight: extracted.mappingFunction(location.dimension, 0),
                };

                // let corners = {
                //     bottomLeft: { x: 10, y: 210 },
                //     bottomRight: { x: 210, y: 210 },
                //     topLeft: { x: 10, y: 10 },
                //     topRight: { x: 210, y: 10 },
                // };
                if (window.hasOwnProperty("corners")) {
                    // tslint:disable-next-line:no-string-literal
                    corners = window["corners"];
                }

                const topLeft = document.getElementById("topLeft");
                topLeft.style.top = corners.topLeft.y + "px";
                topLeft.style.left = corners.topLeft.x + "px";

                const topRight = document.getElementById("topRight");
                topRight.style.top = corners.topRight.y + "px";
                topRight.style.left = corners.topRight.x + "px";

                const bottomLeft = document.getElementById("bottomLeft");
                bottomLeft.style.top = corners.bottomLeft.y + "px";
                bottomLeft.style.left = corners.bottomLeft.x + "px";

                const bottomRight = document.getElementById("bottomRight");
                bottomRight.style.top = corners.bottomRight.y + "px";
                bottomRight.style.left = corners.bottomRight.x + "px";

                // ORDER IS IMPORTANT
                let cornersList = [
                    { ...corners.bottomLeft },
                    { ...corners.bottomRight },
                    { ...corners.topRight },
                    { ...corners.topLeft },
                ];
                if (window.hasOwnProperty("cornersList")) {
                    // tslint:disable-next-line:no-string-literal
                    cornersList = window["cornersList"];
                }

                // Average the corners so that we get less jitter
                const avgCorners = this.averageCorners(cornersList);

                this.render3d(avgCorners);

                // const posit = new Posit(50, width);
                // const pose = posit.pose(cornersList);
                // console.log(pose.bestRotation);
                // const rotation = pose.getRotationDeg();
                // const translation = pose.getTranslation();

                // const rotationAxis = pose.getRotationAxis();
                // const rotationAngle = pose.getRotationAngle();
                // // z x y
                // // console.table(rotation);

                // const debugOverlay = document.getElementById("debugOverlay");
                // debugOverlay.style.transform =
                //     // `rotateX(${rotation.x}rad) rotateY(${rotation.y - 1}rad) rotateZ(${rotation.z}rad)`;
                //     // `rotateZ(${rotation.z}deg) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
                //     `rotate3d(${rotationAxis[0]}, ${rotationAxis[1]}, ${rotationAxis[2]}, ${rotationAngle}rad)`;
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        return started;
    }

    private averageCorners(corners) {
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

    private setup3d() {
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

        this.renderer.render(this.scene, this.camera);
    }

    private render3d(corners) {
        if (!this.renderer) {
            return;
        }
        // Corners have to be relative to canvas center
        for (const corner of corners) {
            corner.x = corner.x - (this.width / 2);
            corner.y = (this.height / 2) - corner.y;
        }

        // Get the rotation/translation of the model based on the corners
        const posit = new Posit(this.modelSize, this.width);
        const pose = posit.pose(corners);

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

        // step += 0.025;
        // model.rotation.z -= step;

        this.renderer.render(this.scene, this.camera);
    }
}
