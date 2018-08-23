import { Posit } from "./Posit";

const getPose = (corners) => {
    // ORDER IS IMPORTANT
    const cornersList = [
        { ...corners.bottomLeft },
        { ...corners.bottomRight },
        { ...corners.topRight },
        { ...corners.topLeft },
    ];

    // Corners have to be relative to canvas center
    for (const corner of cornersList) {
        corner.x = corner.x - (width / 2);
        corner.y = (height / 2) - corner.y;
    }

    // Get a new Pose (estimation) from the corners
    const posit = new Posit(markerSize, width);
    const pose = posit.pose(cornersList);

    // Get the rotation/translation of the model from the pose
    if (pose.isError()) {
        return;
    }
    const rotation = pose.getRotation();
    const translation = pose.getTranslation();

    // Validate Pose
    const poseValid = validatePose(rotation, translation);
    if (!poseValid) {
        return;
    }

    return { rotation, translation };
}

onmessage = event => {
    console.log(event.data)
}