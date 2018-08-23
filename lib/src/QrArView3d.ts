import { Posit } from "./Posit";

export class QrArView3d {
    private renderer;
    private camera;
    private scene;
    private previousCorners = [];

    constructor(
        private THREE: any,
        private root: HTMLElement,
        private height: number,
        private width: number,
        private model?: any,
        private modelSize?: number,
    ) {
        if (!model) {
            // tslint:disable-next-line:no-console
            console.warn("No model provided, creating demo box");
            const geometry = new this.THREE.BoxGeometry(1, 1, 1);
            const material = new this.THREE.MeshNormalMaterial({
                opacity: 0.5,
                side: this.THREE.DoubleSide,
                transparent: true,
            });
            // model = new this.THREE.Mesh(geometry, material);
        }
        this.model = model;

        if (!modelSize) {
            // tslint:disable-next-line:no-console
            console.warn("No modelSize provided, using 50mm");
            modelSize = 100;
        }
        this.modelSize = modelSize;

        this.setup();
    }

    public render(corners) {
        if (!this.renderer || !this.model || !this.modelSize) {
            return;
        }

        // ORDER IS IMPORTANT
        const cornersList = [
            { ...corners.bottomLeft },
            { ...corners.bottomRight },
            { ...corners.topRight },
            { ...corners.topLeft },
        ];

        // Average the corners so that we get less jitter
        const avgCorners = this.averageCorners(cornersList);

        const range = this.calculateRangeOfAverageCornerDistance(this.previousCorners);
        // if the range is is too large, then early exist
        const rangeThreshold = 5;
        if (range > rangeThreshold) {
            return;
        }

        // Debug:
        const topLeft = document.getElementById("topLeft2");
        topLeft.style.top = avgCorners[3].y + "px";
        topLeft.style.left = avgCorners[3].x + "px";

        const topRight = document.getElementById("topRight2");
        topRight.style.top = avgCorners[2].y + "px";
        topRight.style.left = avgCorners[2].x + "px";

        const bottomLeft = document.getElementById("bottomLeft2");
        bottomLeft.style.top = avgCorners[0].y + "px";
        bottomLeft.style.left = avgCorners[0].x + "px";

        const bottomRight = document.getElementById("bottomRight2");
        bottomRight.style.top = avgCorners[1].y + "px";
        bottomRight.style.left = avgCorners[1].x + "px";

        // Corners have to be relative to canvas center
        for (const corner of avgCorners) {
            corner.x = corner.x - (this.width / 2);
            corner.y = (this.height / 2) - corner.y;
        }

        // Get the rotation/translation of the model based on the corners
        const posit = new Posit(this.modelSize, this.width);
        const pose = posit.pose(avgCorners);

        // ROTATTION V1
        // Update model
        const rotation = pose.getRotation();
        // Add additional rotation to make R2D2 stand up
        // this.model.rotation.order = 'YXZ';
        // this.model.rotation.x = rotation.x - Math.PI / 2;
        // this.model.rotation.y = rotation.z - Math.PI / 2;
        // this.model.rotation.z = rotation.y;

        // ROTATION V2
        const rotationAngle = pose.getRotationAngle();
        const rotationAxis = pose.getRotationAxis();
        const rotationAxisVector = new this.THREE.Vector3(rotationAxis[0], rotationAxis[1], rotationAxis[2]);
        console.table({ ...rotationAxis, rotationAngle })
        // this.model.setRotationFromAxisAngle(rotationAxisVector, rotationAngle);

        // ROTATION V3
        // this.model.quaternion.setFromUnitVectors(new this.THREE.Vector3(1, 0, 0), rotationAxisVector.clone().normalize());
        console.table({ ...this.model.quaternion })

        // ROtation original
        this.model.rotation.x = rotation.x - Math.PI / 2;
        this.model.rotation.y = rotation.y;
        this.model.rotation.z = rotation.z;



        const position = pose.getPosition();
        this.model.position.x = position.x;
        this.model.position.y = position.y;
        this.model.position.z = position.z;

        console.log(this.model.rotation.order);

        var debugOverlay = document.getElementById("debugOverlay");
        var debugContainer = document.getElementById("debugContainer")
        if (debugOverlay) {
            debugOverlay.style.position = 'fixed';
            debugOverlay.style.top = '0';
            debugOverlay.style.left = '0';
            debugOverlay.style.width = '100px';
            debugOverlay.style.height = '100px';
            debugOverlay.style.transformOrigin = 'top left';
            // debugOverlay.style.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAAD2CAMAAABC3/M1AAAAilBMVEX/////AAD/eXn/ZGT/+/v/6+v/RUX/fn7/SUn/zs7/VFT/Tk7/goL/V1f/amr/aGj/sLH/oqL/XFz/7u//trf/2Nj/9PT/jIz/cXH/m5v/09P/5+f/wMD/MTH/lZX/39//Ozv/Kir/HBz/OTn/dHT/xcX/JCT/EhP/hob/Fxf/kZH/Li7/urr/qKjDGfDjAAAElElEQVR4nO3di1bbMBAEUBZMwrOFmJjwKoHwakv+//daOJQCsce2tNLKytwf6M7paarZyM7GRgzFbpQ/JpKRTK1H0DMRkWvrIbTM5MWF9Rg6Dl7DyGNpPYiGU3lzU1mP4u9M3s0L62F8LeWDHetpPD3LJxPrebzsyhcz64k8nH8NI3JgPZOz69UwIqfWUznargsjcmY9l5OqPozIkfVkDorbpjRyaT1bf1eNYUQG1w9GIIwMrR9MYJiB9YNZSxiRbesRuztoDSO3gzlQn7aHEbkayIH6rD3Ki2H0g6NuYUT2rSft4LJrGJEt61lbrXQA5M562hY1HQB5sp4Xqu0AyC/riYGGDoAcW8/cqLEDIM/WUzcoHlzSyL313LUK1AGQc+vJ6+w4hkmyH7R1ACS5hXt7BwB+JrZw79ABkLQW7p06ALJI6EDdsQMg6Szcl+3Dtju0TvGmRwdAvlnneNWrAyBj6yR/TbXCpLBw790BkB/GYRw6ALI0DVM96qYxXbg7dgDEbuFeLNTDGPYD9w6AGC3cfToAYtIPvDoAYrFw9+wASPyFu3cHQGIv3BU6ABJ34d75ewBXMS/kKHUAJN6FHLUOgMS6kKPYAZA4/UC1AyAxLuRcxAojchI8TKndAZDQC/fiJmKY0P2gmEcNE3jhHqYDIAH7QagOADwGu5ATrAMgD4H6QcAOgIRZuAftAMg8QJjAHQDR7wfBOwCifSEnQgdAdC/kROkAiOaFnJ53gULQW7hH6wCI1sI9YgdAdC7klM1X6OPS6AfFb+sU7/wX7tE7AOLdD+J3AMRz4W7QAZBbrws5Jh0AufE4UI+th1+1cA5j1gGQkWMYww6AuF3IMe0AiMuFHOMOgPS/kGPeAZC+C/cEOgDSb+GeRAdA+jwBm0gHQLpfyEmmAyBdF+5VOh0A6XagTqoDIJ0W7ml1AKDLwj2xDoC0X8hJrgMgVy1hEuwAyByGebIery90YT/RDoA0X8hJtgMgTQv3hDsAUr9wT7oDIHUL98Q7ALL6BGyki01hfL2QM4AOgHxeuA+iAyAfF+4JfQ/g6n8/CPI8QGzvC3f8XqCB+PfKyQF1AOThdeG+ZT2Glpc493ebHrTr0Nhjljvvb+GVn1sT33n8lFmlyevvhmmYJo7yaqTJ/TtaHYUu4zCXJ6ps4+T174ZpmIZpmIZpmIZp+qrOjjUN8w3yqSpKVbanzmrzQJPxi63y+hRgGqZhGqZhGqaJoTifqrJNs1FeqErodbeDV873Nbk+KqQkr08BpmEapmEapkk1TXGkiycbqlcudjTNbdPk9SnANEzDNEyTU5pq71BTOr/po4LnNKqnfEt1bpsmr880pmEapln3NHk9TaSNJxtaB+VoT1Pc3yRakdcnNNMwDdOse5piuquKJxuioSn3J5r2bNPk9QnNNEzDNP1VPi8qWjXL62STVxqidVAdbmmK+aPYNfL6/4ZpmCaOcpTT00TaeLIhIkvV5Jsm7R8n7imv/z2ZhmkiqbZV8WRDRKSlmnzXxHMa06xFmmqp+75OnmyIiKgOv/dM9yyQV5pqrGozr5ONZ5o/b6C3W2tS+wIAAAAASUVORK5CYII=")';
            // debugOverlay.style.backgroundSize = "contain";
            // debugOverlay.style.transform = `rotate3d(${-1 * (rotationAxis[0])},${-1 * rotationAxis[1]},${rotationAxis[2]},${rotationAngle}rad) scaleX(-1) scaleY(-1) scaleZ(-1)`; // rotateZ(180deg) rotateX(180deg) rotateY(180deg)
            // debugContainer.style.transform = `scale(${10 / position.z}) translate3d(${position.x + (this.width / 2)}px, ${-position.y + (this.height / 2)}px, 0px)`;
            debugContainer.style.transformStyle = 'preserve-3d';
            // debugOverlay.style.perspective = `${-1 * position.z}px`
            debugOverlay.style.transform =
                `translateX(${avgCorners[3].x + (this.width / 2)}px) ` +
                `translateY(${-avgCorners[3].y + (this.height / 2)}px) ` +
                `translateZ(${position.z}px) ` +
                `rotateX(${(-1 * rotation.x) + Math.PI}rad) ` +
                `rotateY(${-1 * rotation.z}rad) ` +
                `rotateZ(${-1 * rotation.y}rad) `
        }

        const unitScale = 1;
        this.model.scale.x = unitScale;
        this.model.scale.y = unitScale;
        this.model.scale.z = unitScale;

        this.renderer.render(this.scene, this.camera);
    }

    private setup() {
        // Create renderer

        this.renderer = new this.THREE.WebGLRenderer({ alpha: true });
        console.log("----")
        console.log(this.renderer)
        this.renderer.setSize(this.width, this.height);
        this.root.appendChild(this.renderer.domElement);

        // Create scene
        this.scene = new this.THREE.Scene();
        this.camera = new this.THREE.PerspectiveCamera(40, this.width / this.height, 1, 2000);
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

    private averageCorners(corners) {
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
    private calculateRangeOfAverageCornerDistance(previousQuadriangles) {
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

    private calcPerimeter(corners, numOfSides) {
        let cumulativeDistance = 0;
        for (let i = 0; i < numOfSides; i++) {
            const first = corners[i];
            const second = corners[i + 1];
            const sideDistance = Math.hypot(second.x - first.x, second.y - first.y);
            cumulativeDistance += sideDistance;
        }
        return cumulativeDistance;
    }
}
