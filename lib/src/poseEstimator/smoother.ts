export function averageCorners(corners) {
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

// Findes the range between the perimeters of the quardriangles
export function calculateRangeOfAverageCornerDistance(previousQuadriangles) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    previousQuadriangles.forEach((corners) => {
        const numOfSides = corners.length - 1;
        const cumulativeDistance = this.calcPerimeter(corners, numOfSides);
        const avgDistance = cumulativeDistance / numOfSides;
        min = Math.min(min, avgDistance);
        max = Math.max(max, avgDistance);
    });
    const range = (max - min) / previousQuadriangles.length;
    return range;
}

export function calcPerimeter(corners, numOfSides) {
    let cumulativeDistance = 0;
    for (let i = 0; i < numOfSides; i++) {
        const first = corners[i];
        const second = corners[i + 1];
        const sideDistance = Math.hypot(second.x - first.x, second.y - first.y);
        cumulativeDistance += sideDistance;
    }
    return cumulativeDistance;
}