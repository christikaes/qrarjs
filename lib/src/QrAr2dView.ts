export default class QrAr2dView {
    public private;

    constructor(
        private root: HTMLElement,
        private panel: HTMLElement,
    ) {
        this.setup();
    }

    public render(rotation, translation, topLeftCorner) {
        this.panel.style.transform =
            `translateX(${topLeftCorner.x}px) ` +
            `translateY(${topLeftCorner.y}px) ` +
            `translateZ(${translation.z}px) ` +
            `rotateX(${(-1 * rotation.x) + Math.PI}rad) ` +
            `rotateY(${-1 * rotation.z}rad) ` +
            `rotateZ(${-1 * rotation.y}rad) `;
    }

    private setup() {
        this.panel.style.position = "absolute";
        // this.panel.style.transition = 'transform 10ms linear';
        this.panel.style.top = "0";
        this.panel.style.left = "0";
        this.panel.style.transformOrigin = "top left";
    }
}
