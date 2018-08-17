import * as THREE from "three";
import { binarize } from "./binarizer";
import { extract } from "./extractor";
import { locate, Point } from "./locator";
import { QrArView3d } from "./QrArView3d";

// QrAr.js
// This class takes in an HTMLElement as the root and creates a QrAr in it
export class QrAr {
    private view3d: QrArView3d;
    private height: number;
    private width: number;

    constructor(
        private root: HTMLElement,
        private model?: THREE.Group,
        private modelSize?: number,
    ) {
        if (!root) {
            throw new Error("Must pass in a valid HTMLElement to QrAr");
        }

        this.setup();
    }

    private async setup() {
        const video = await this.setupVideo();
        await this.start(video);
        this.view3d = new QrArView3d(this.root, this.height, this.width, this.model, this.modelSize);
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

                // Locate the QR Code
                let location = locate(binarized);
                if (!location) {
                    location = locate(binarized.getInverted());
                }

                if (!location) {
                    // console.log("No Location");
                    requestAnimationFrame(tick);
                    return;
                }

                // Extract so that we can get the position of bottomRight
                const extracted = extract(binarized, location);

                const corners = {
                    bottomLeft: extracted.mappingFunction(0, location.dimension),
                    bottomRight: extracted.mappingFunction(location.dimension, location.dimension),
                    topLeft: extracted.mappingFunction(0, 0),
                    topRight: extracted.mappingFunction(location.dimension, 0),
                };

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

                if (this.view3d) {
                    this.view3d.render(corners);
                }
            }

            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        return started;
    }
}
