// Estimated Pose
export default class Pose {
    constructor(
        private bestError,
        private bestRotation,
        private bestTranslation,
        private alternativeError,
        private alternativeRotation,
        private alternativeTranslation,
    ) { }

    public getRotationAxis() {
        // https://en.wikipedia.org/wiki/Rotation_matrix -> Determning the axis
        const rotationMat = this.bestRotation;
        return [
            rotationMat[2][1] - rotationMat[1][2],
            rotationMat[0][2] - rotationMat[2][0],
            rotationMat[1][0] - rotationMat[0][1],
        ];
    }

    public getRotationAngle() {
        // https://en.wikipedia.org/wiki/Rotation_matrix -> Determning the angle
        const rotationMat = this.bestRotation;
        const rotationTrace = rotationMat[0][0] + rotationMat[1][1] + rotationMat[2][2];
        return Math.acos((rotationTrace - 1) / 2);
    }

    public isError() {
        return isNaN(this.bestError) || this.bestError > 2;
    }

    public getRotation() {
        const rotationMat = this.bestRotation;
        // https://en.wikipedia.org/wiki/Rotation_matrix
        // Base calculation taken from: http://nghiaho.com/?page_id=846
        //    y and z were swapped
        //    x was rotating the wrong way
        const rotation = {
            x: -Math.atan2(rotationMat[2][1], rotationMat[2][2]),
            y: Math.atan2(rotationMat[1][0], rotationMat[0][0]),
            z: Math.atan2(-rotationMat[2][0], Math.sqrt(
                Math.pow(rotationMat[2][1], 2)
                + Math.pow(rotationMat[2][2], 2))),
        };

        return rotation;
    }

    public getTranslation() {
        const translationVec = this.bestTranslation;
        return {
            x: translationVec[0],
            y: translationVec[1],
            z: -translationVec[2],
        };
    }
}
