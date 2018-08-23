import QrAr3dView from './QrAr3dView';
import QrAr2dView from './QrAr2dView';
import { setupImageFeed } from './imageFeed';
import { locateMarker } from './markerLocator';
import { estimatePose } from './poseEstimator';
import { renderCornerDebugger } from './debug'

/**
* Creates a new QrAr3dView in the given element
*/
export function QrAr3d(
    THREE: any,
    root: HTMLElement,
    markerSize: number,
    model: any,
    modelScale: number,
    debug: boolean = false
): void {
    // Setup styles on root
    root.style.position = 'relative';

    // Create a new 3dView
    const qrAr3dView = new QrAr3dView(THREE, root, model, modelScale);

    // Processing image feed
    setupImageFeed(root, (imageData, width, height) => {
        const corners = locateMarker(imageData, width, height);
        if (!corners) { return; }
        if (debug) { renderCornerDebugger(root, corners) };

        const pose = estimatePose(corners, width, height, markerSize);
        if (!pose) { return }

        qrAr3dView.render(pose.rotation, pose.translation, width, height)
    })
}

/**
* Creates a new QrAr2dView in the given element
*/
export function QrAr2d(
    root: HTMLElement,
    markerSize: number,
    panel: HTMLElement,
    debug: boolean = false
): void {
    // Setup styles on root
    root.style.position = 'relative';

    // Create a new 2d view
    const qrAr2dView = new QrAr2dView(root, panel);

    // Processing image feed
    setupImageFeed(root, (imageData, width, height) => {
        const corners = locateMarker(imageData, width, height);
        if (!corners) { return; }
        if (debug) { renderCornerDebugger(root, corners) };

        const pose = estimatePose(corners, width, height, markerSize);
        if (!pose) { return; }

        qrAr2dView.render(pose.rotation, pose.translation, corners.topLeft)
    })
}
