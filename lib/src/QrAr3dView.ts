export default class QrAr3dView {
    private renderer;
    private camera;
    private scene;

    constructor(
        private THREE: any,
        private root: HTMLElement,
        private model: any,
        private modelScale: number,
    ) {
        this.setup();
    }

    public render(rotation, translation, width, height) {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;

        this.model.rotation.x = rotation.x - Math.PI / 2;
        this.model.rotation.y = rotation.y;
        this.model.rotation.z = rotation.z;

        this.model.position.x = translation.x;
        this.model.position.y = translation.y;
        this.model.position.z = translation.z;

        this.model.scale.x = this.modelScale;
        this.model.scale.y = this.modelScale;
        this.model.scale.z = this.modelScale;

        this.renderer.render(this.scene, this.camera);
    }

    private setup() {
        // Create renderer
        this.renderer = new this.THREE.WebGLRenderer({ alpha: true });
        const rendererElement = this.renderer.domElement;
        rendererElement.style.position = 'absolute';
        this.root.appendChild(rendererElement);

        // Create scene
        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(40, 1, 1, 2000); // aspect is set in render
        this.scene.add(this.camera);

        // Add model
        this.scene.add(this.model);

        // Add lights
        const light = new this.THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);
        const ambient = new this.THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambient);

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}
