export default class Pose {
    public bestError;
    public bestRotation;
    public bestTranslation;
    public alternativeError;
    public alternativeRotation;
    public alternativeTranslation;

    constructor(error1, rotation1, translation1, error2, rotation2, translation2) {
        this.bestError = error1;
        this.bestRotation = rotation1;
        this.bestTranslation = translation1;
        this.alternativeError = error2;
        this.alternativeRotation = rotation2;
        this.alternativeTranslation = translation2;
    }

    public getTranslation() {
        const translationVec = this.bestTranslation;
        return {
            x: translationVec[0],
            y: translationVec[1],
            z: translationVec[2],
        };
    }

    public getRotationDeg() {
        const rotationRad = this.getRotation();
        return {
            x: Math.round(rotationRad.x * 180 / Math.PI),
            y: Math.round(rotationRad.y * 180 / Math.PI),
            z: Math.round(rotationRad.z * 180 / Math.PI),
        };
    }

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
        const rotationMat = this.bestRotation;
        const rotationTrace = rotationMat[0][0] + rotationMat[1][1] + rotationMat[2][2];
        return Math.acos((rotationTrace - 1) / 2);
    }

    public getRotation() {
        const rotationMat = this.bestRotation;
        // https://en.wikipedia.org/wiki/Rotation_matrix
        return {
            x: -Math.asin(-rotationMat[1][2]),
            y: Math.atan2(rotationMat[0][2], rotationMat[2][2]),
            z: Math.atan2(rotationMat[1][0], rotationMat[1][1]),
        };
    }

    public getPosition() {
        const translationVec = this.bestTranslation;
        return {
            x: translationVec[0],
            y: translationVec[1],
            z: -translationVec[2],
        };
    }
}
