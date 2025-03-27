import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const MinecraftSceneBuilder = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);

    const blockSize = 1;
    const blockTextures = {};

    const loadTexture = (name) => {
      return new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(`/assets/${name}.png`)
      });
    };

    const createBlock = (x, y, z, type) => {
      if (!blockTextures[type]) {
        blockTextures[type] = loadTexture(type);
      }
      const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
      const cube = new THREE.Mesh(geometry, blockTextures[type]);
      cube.position.set(x, y, z);
      scene.add(cube);
    };

    const loadTemplate = (templateName) => {
      fetch(`/assets/${templateName}.json`)
        .then(res => res.json())
        .then(data => {
          scene.clear();
          scene.add(light);
          data.blocks.forEach(b => {
            createBlock(b.x, b.y, b.z, b.type);
          });
        })
        .catch(err => console.error("Error loading template:", err));
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.loadTemplate = loadTemplate;

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button 
          onClick={() => window.loadTemplate('house')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Load House
        </button>
        <button 
          onClick={() => window.loadTemplate('farm')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Load Farm
        </button>
      </div>
    </div>
  );
};

export default MinecraftSceneBuilder;
