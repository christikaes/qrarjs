export function renderCornerDebugger(root: HTMLElement, corners) {
    let topLeft = document.getElementById("topLeft")
    if (!topLeft) {
        topLeft = document.createElement("div");
        topLeft.id = "topLeft"
        root.appendChild(topLeft);
    }
    topLeft.innerText = "TL";
    topLeft.style.position = "absolute";
    topLeft.style.top = corners.topLeft.y + "px";
    topLeft.style.left = corners.topLeft.x + "px";
    topLeft.style.height = "10px";
    topLeft.style.width = "10px";
    topLeft.style.border = "1px solid blue";

    let topRight = document.getElementById("topLeft")
    if (!topRight) {
        topRight = document.createElement("div");
        topRight.id = "topRight"
        root.appendChild(topRight);
    }
    topRight.innerText = "TR";
    topRight.style.position = "absolute";
    topRight.style.top = corners.topRight.y + "px";
    topRight.style.left = corners.topRight.x + "px";
    topRight.style.height = "10px";
    topRight.style.width = "10px";
    topRight.style.border = "1px solid red";

    let bottomLeft = document.getElementById("bottomLeft")
    if (!bottomLeft) {
        bottomLeft = document.createElement("div");
        bottomLeft.id = "bottomLeft"
        root.appendChild(bottomLeft);
    }
    bottomLeft.innerText = "BL";
    bottomLeft.style.position = "absolute";
    bottomLeft.style.top = corners.bottomLeft.y + "px";
    bottomLeft.style.left = corners.bottomLeft.x + "px";
    bottomLeft.style.height = "10px";
    bottomLeft.style.width = "10px";
    bottomLeft.style.border = "1px solid green";

    let bottomRight = document.getElementById("bottomRight")
    if (!bottomRight) {
        bottomRight = document.createElement("div");
        bottomRight.id = "bottomRight"
        root.appendChild(bottomRight);
    }
    bottomRight.innerText = "BR";
    bottomRight.style.position = "absolute";
    bottomRight.style.top = corners.bottomRight.y + "px";
    bottomRight.style.left = corners.bottomRight.x + "px";
    bottomRight.style.height = "10px";
    bottomRight.style.width = "10px";
    bottomRight.style.border = "1px solid yellow";
}
