import React, { useEffect } from "react";
import "./index.less";

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Vector3,
    Color,
    AmbientLight,
    PointLight,
    CylinderGeometry,
    MeshLambertMaterial,
    Mesh
} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
    let scene: Scene, camera: PerspectiveCamera, controls: OrbitControls, mesh: Mesh, renderer: WebGLRenderer;

    useEffect(() => {
        threeStart();
    }, []);

    let stats;
    const initThree = (width: number, height: number) => {
        renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        document.getElementById('three-container')?.appendChild(renderer.domElement);
        renderer.setClearColor(0xFFFFFF, 1.0);
    };

    const initCamera = (width: number, height: number) => {
        camera = new PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        const zero = new Vector3(0, 0, 0);
        camera.lookAt(zero);
    };

    const initScene = () => {
        scene = new Scene();
        scene.background = new Color(0xbfd1e5);
    }

    const initLight = () => {
        const amlight = new AmbientLight(0xFF0000);
        amlight.position.set(100, 100, 200);
        scene.add(amlight);
        const pointlight = new PointLight(0x00FF00);
        pointlight.position.set(0, 0, 300);
        scene.add(pointlight);
    };

    const initObject = () => {
        const geometry: CylinderGeometry = new CylinderGeometry(100, 150, 400);
        const material = new MeshLambertMaterial({ color: 0xFFFFFF });
        geometry.lookAt(new Vector3(0, 0, 0));
        mesh = new Mesh(geometry, material);

        scene.add(mesh);
    }

    const initControl = () => {
        const pCanvas = document.getElementById('three-container');
        controls = new OrbitControls(camera, pCanvas || undefined);

        controls.enableDamping = true;

        controls.enableZoom = true;

        controls.autoRotateSpeed = 0.5;

        controls.maxDistance = 10000;

        controls.enablePan = true;
    }

    const animation = () => {
        controls.update();
        mesh.rotateY(0.01);
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }

    const threeStart = () => {
        const width = document.getElementById('three-container')?.clientWidth || 0;
        const height = document.getElementById('three-container')?.clientHeight || 0;
        initThree(width, height);
        initCamera(width, height);
        initScene();
        initLight();
        initControl();
        initObject();
        animation();
    }

    return (
        <div className="three-container main-container" id="three-container">
        </div>
    );
}
