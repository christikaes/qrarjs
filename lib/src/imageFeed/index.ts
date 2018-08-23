// ImageFeed
// This class creates a new ImageFeed
// It uses getUserMedia to request for video access, and for each frame calls the given callback with the image from that frame
export async function setupImageFeed(
    root: HTMLElement,
    callback: (imageData: Uint8ClampedArray, width: number, height: number) => void
) {
    // Create a new video element and append it to the root
    const video = document.createElement("video");
    video.style.position = 'absolute';
    video.style.zIndex = '-1';
    root.appendChild(video);

    // Get a video stream and start the video
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment", // non-selfie camera
        },
    });
    video.srcObject = stream;
    video.setAttribute("playsinline", "true"); // iOS safari - we don't want fullscreen
    video.play();

    // Create a hidden canvas so that we can extract imageData from the stream
    const hiddenCanvas = document.createElement("canvas");
    const hiddenCanvasCtx = hiddenCanvas.getContext("2d");

    // Function to be called for every frame
    const processFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            // Get ImageData from current video frame
            const width = video.videoWidth;
            const height = video.videoHeight;
            hiddenCanvas.height = height;
            hiddenCanvas.width = width;
            hiddenCanvasCtx.drawImage(video, 0, 0, width, height);
            const imageData = hiddenCanvasCtx.getImageData(0, 0, width, height);

            // Send the imageData to the given callback
            callback(imageData.data, width, height);
        }

        requestAnimationFrame(processFrame);
    };

    // Start requesting the animation frame
    requestAnimationFrame(processFrame);
}
