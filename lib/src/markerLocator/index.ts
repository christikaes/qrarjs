import { binarize } from "./binarizer";
import { extract } from "./extractor";
import { locate } from "./locator";

export function locateMarker(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
) {
    // Binarize the ImageData
    const binarized = binarize(imageData, width, height);

    // Locate the QR Code
    let location = locate(binarized);
    if (!location) {
        location = locate(binarized.getInverted());
    }

    // Could not locate a QR code
    if (!location) {
        return;
    }

    // Extract so that we can get the position of bottomRight
    const extracted = extract(binarized, location);

    // Get the corners
    const corners = {
        bottomLeft: extracted.mappingFunction(0, location.dimension),
        bottomRight: extracted.mappingFunction(location.dimension, location.dimension),
        topLeft: extracted.mappingFunction(0, 0),
        topRight: extracted.mappingFunction(location.dimension, 0),
    };

    return corners;
}
