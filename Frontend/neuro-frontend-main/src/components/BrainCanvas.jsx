import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls, GLTFLoader } from "three-stdlib";
import brainModel from "./brain.glb?url";

export default function BrainCanvas() {
  const mountRef = useRef(null);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const [isLoading, setIsLoading] = useState(true);
  const hasInteractedRef = useRef(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene & Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background

    const camera = new THREE.PerspectiveCamera(
      75, // fov
      mount.clientWidth / mount.clientHeight, // aspect
      0.1, // near
      1000 // far
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting (NeuroVerse theme with shadows)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b9d, 1.5, 10);
    pointLight.position.set(-3, 0, 3);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x4d5b70, 1);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Controls with interaction detection
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false; // Prevent panning - keep brain centered
    controls.enableRotate = true; // Allow camera rotation around brain
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controls.target.set(0, 0, 0); // Camera orbits around brain's center (0,0,0)
    controls.target0.set(0, 0, 0); // Set default target
    controls.saveState(); // Save this as the default state

    // Stop auto-rotation permanently on first interaction
    const handleInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        controls.autoRotate = false;
      }
    };

    controls.addEventListener('start', handleInteraction);

    // Material factory function
    const createBrainMaterial = () => {
      return new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
        emissive: 0x001122,
        emissiveIntensity: 0.1
      });
    };

    // Load Brain Model
    const loader = new GLTFLoader();
    setLoadingStatus("Loading brain model...");

    loader.load(
      brainModel,
      (gltf) => {
        const brain = gltf.scene;

        // Calculate bounding box to determine size
        const box = new THREE.Box3().setFromObject(brain);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale uniformly to target size of ~5 world units BEFORE centering
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = targetSize / maxDim;
        brain.scale.setScalar(scale);

        // Recalculate bounding box after scaling
        box.setFromObject(brain);
        const scaledCenter = box.getCenter(new THREE.Vector3());

        // Center the model at world origin (0,0,0) - fixed position
        brain.position.set(-scaledCenter.x, -scaledCenter.y, -scaledCenter.z);

        // Apply custom material to each mesh with shadows
        brain.traverse((child) => {
          if (child.isMesh) {
            child.material = createBrainMaterial();
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Add brain to scene at origin - it will NEVER move
        scene.add(brain);

        // Position camera at 45-degree angle for aesthetic view
        // Use the target size (5) instead of calculated size to ensure proper framing
        const cameraDistance = targetSize * 2.5; // Distance based on target size
        camera.position.set(
          cameraDistance * 0.7,
          cameraDistance * 0.5,
          cameraDistance * 0.7
        );
        camera.lookAt(0, 0, 0);
        controls.update();

        setLoadingStatus("Brain ready!");
        setIsLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setLoadingStatus(`Loading brain: ${percent}%`);
        }
      },
      (error) => {
        console.error("Error loading brain model:", error);
        setLoadingStatus("Creating fallback brain...");

        // Fallback Brain - procedural generation
        const fallbackGroup = new THREE.Group();

        // Main sphere with pink material and cyan emissive glow
        const mainGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const mainMaterial = createBrainMaterial();
        mainMaterial.emissive = new THREE.Color(0x00f0ff);
        mainMaterial.emissiveIntensity = 0.2;
        const mainSphere = new THREE.Mesh(mainGeometry, mainMaterial);
        mainSphere.castShadow = true;
        mainSphere.receiveShadow = true;
        fallbackGroup.add(mainSphere);

        // 5 smaller region spheres positioned around main sphere
        const regions = [
          { pos: [0.8, 1.2, 0.5], color: 0x00f0ff, radius: 0.4 }, // Top cyan 1
          { pos: [-0.8, 1.2, 0.5], color: 0x00f0ff, radius: 0.4 }, // Top cyan 2
          { pos: [0, -1.2, 0], color: 0x4d5b70, radius: 0.5 }, // Bottom blue-gray (cerebellum)
          { pos: [0.6, 0.3, -1.4], color: 0xff6b9d, radius: 0.35 }, // Back region 1
          { pos: [-0.6, 0.3, -1.4], color: 0xff6b9d, radius: 0.35 } // Back region 2
        ];

        regions.forEach(({ pos, color, radius }) => {
          const geometry = new THREE.SphereGeometry(radius, 16, 16);
          const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            transparent: true,
            opacity: 0.9,
            emissive: color,
            emissiveIntensity: 0.1
          });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(...pos);
          sphere.castShadow = true;
          sphere.receiveShadow = true;
          fallbackGroup.add(sphere);
        });

        scene.add(fallbackGroup);

        // Position camera for fallback brain
        camera.position.set(3, 2, 4);
        camera.lookAt(0, 0, 0);
        controls.update();

        setLoadingStatus("Brain ready!");
        setIsLoading(false);
      }
    );

    // Resize Handling
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop - 60fps
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Comprehensive Cleanup
    return () => {
      // Cancel animation frame
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      // Remove event listeners
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener('start', handleInteraction);

      // Dispose controls
      if (controls) {
        controls.dispose();
      }

      // Remove renderer DOM element
      if (renderer && renderer.domElement) {
        if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }

      // Dispose all geometries and materials
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
    };
  }, []);

  return (
    <div
      className="w-full aspect-square rounded-xl relative overflow-hidden shadow-xl shadow-primary/30 cursor-grab active:cursor-grabbing"
      style={{
        background: 'linear-gradient(-45deg, #00f0ff, #0a0a0f, #0f171f, #4d5b70)',
        padding: '2px'
      }}
    >
      <div
        ref={mountRef}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ background: '#000000' }}
      />

      {/* Status Overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <h3 className="text-white font-bold text-lg drop-shadow-lg">
          Interactive Brain Activity
        </h3>
        <p className="text-white/90 text-sm mt-1 drop-shadow-lg">
          {isLoading ? loadingStatus : 'Drag to rotate • Scroll to zoom'}
        </p>
      </div>
    </div>
  );
}