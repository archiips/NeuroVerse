import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three-stdlib";
import brainModel from "./brain.glb?url";

export default function InteractiveBrain() {
  const mountRef = useRef(null);
  const [loadingStatus, setLoadingStatus] = useState("Initializing 3D scene...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let scene, camera, renderer, controls, animationId;
    let userHasInteracted = false;

    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting setup matching your theme
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Main cyan directional light
    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Pink accent point light
    const pointLight = new THREE.PointLight(0xff6b9d, 1, 15);
    pointLight.position.set(-3, 2, 2);
    scene.add(pointLight);

    // Blue-gray rim light for depth
    const rimLight = new THREE.DirectionalLight(0x4d5b70, 0.8);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Controls setup
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minDistance = 3;
    controls.maxDistance = 12;

    // Stop auto-rotation when user interacts
    const handleUserInteraction = () => {
      if (!userHasInteracted) {
        userHasInteracted = true;
        controls.autoRotate = false;
      }
    };

    controls.addEventListener('start', handleUserInteraction);

    setLoadingStatus("Loading 3D brain model...");

    // Load brain model
    const loader = new GLTFLoader();
    loader.load(
      brainModel,
      (gltf) => {
        const brain = gltf.scene;

        // Compute bounding box and center the brain
        const box = new THREE.Box3().setFromObject(brain);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Center the brain at origin
        brain.position.sub(center);

        // Scale the brain to fit nicely in view (consistent sizing)
        const targetSize = 4; // Desired size in world units
        const scaleFactor = targetSize / maxDim;
        brain.scale.setScalar(scaleFactor);

        // Apply theme materials to all meshes
        brain.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0xff6b9d, // Pink main color
              shininess: 100,
              transparent: true,
              opacity: 0.9,
              emissive: 0x001122, // Subtle cyan glow
              emissiveIntensity: 0.1
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        scene.add(brain);

        // Position camera to frame the brain perfectly
        const distance = targetSize * 2;
        camera.position.set(distance * 0.7, distance * 0.5, distance);
        camera.lookAt(0, 0, 0);

        // Update controls target
        controls.target.set(0, 0, 0);
        controls.update();

        setLoadingStatus("Interactive brain ready!");
        setIsLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          const percentComplete = Math.round((progress.loaded / progress.total) * 100);
          setLoadingStatus(`Loading brain: ${percentComplete}%`);
        }
      },
      (error) => {
        console.error("Error loading brain model:", error);
        setLoadingStatus("Creating fallback brain...");

        // Fallback sphere with theme styling
        const geometry = new THREE.SphereGeometry(2, 64, 32);
        const material = new THREE.MeshPhongMaterial({
          color: 0xff6b9d,
          shininess: 100,
          transparent: true,
          opacity: 0.9,
          emissive: 0x00f0ff,
          emissiveIntensity: 0.15
        });
        const fallbackBrain = new THREE.Mesh(geometry, material);
        fallbackBrain.castShadow = true;
        fallbackBrain.receiveShadow = true;
        scene.add(fallbackBrain);

        // Position camera for fallback
        camera.position.set(6, 3, 6);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        setLoadingStatus("Fallback brain ready!");
        setIsLoading(false);
      }
    );

    // Resize handler
    const handleResize = () => {
      if (!mount) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      window.removeEventListener("resize", handleResize);

      if (controls) {
        controls.removeEventListener('start', handleUserInteraction);
        controls.dispose();
      }

      if (renderer) {
        if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      // Clean up scene objects
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  return (
    <div className="w-full aspect-square rounded-xl relative overflow-hidden shadow-xl shadow-primary/30">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ background: '#000000' }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-cyan-400 border-t-transparent mx-auto mb-3"></div>
            <p className="text-white text-sm font-medium">{loadingStatus}</p>
          </div>
        </div>
      )}

      {/* Status overlay */}
      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
        <h3 className="text-lg font-bold text-white drop-shadow-lg mb-1">
          Interactive Brain
        </h3>
      </div>
    </div>
  );
}