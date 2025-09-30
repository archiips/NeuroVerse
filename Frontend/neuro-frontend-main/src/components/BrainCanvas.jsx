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

    // Enhanced Lighting (NeuroVerse theme with shadows)
    const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00f0ff, 3);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b9d, 2.5, 15);
    pointLight.position.set(-3, 0, 3);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x4d5b70, 1.5);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // Additional accent lights for visual appeal
    const topLight = new THREE.PointLight(0x00f0ff, 1.5, 12);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    const bottomLight = new THREE.PointLight(0xff6b9d, 1.2, 10);
    bottomLight.position.set(0, -3, 0);
    scene.add(bottomLight);

    // Particle system for neural connectivity visualization
    const particleCount = 150;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Start particles in a sphere around origin
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities for organic movement
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

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

    // Enhanced Material factory function
    const createBrainMaterial = () => {
      return new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        shininess: 150,
        transparent: true,
        opacity: 0.95,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.3,
        specular: 0x00f0ff,
        reflectivity: 0.8
      });
    };

    // Load Brain Model
    const loader = new GLTFLoader();
    setLoadingStatus("Loading brain model...");
    let brainMesh = null; // Store reference for rotation

    loader.load(
      brainModel,
      (gltf) => {
        // Create a wrapper group for proper centering
        brainMesh = new THREE.Group();
        const brainModel = gltf.scene;

        // Calculate bounding box to determine size
        const box = new THREE.Box3().setFromObject(brainModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Scale uniformly to target size of ~5 world units
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 5;
        const scale = targetSize / maxDim;
        brainModel.scale.setScalar(scale);

        // Center the actual model so group rotation pivots around true center
        brainModel.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Apply custom material to each mesh with shadows
        brainModel.traverse((child) => {
          if (child.isMesh) {
            child.material = createBrainMaterial();
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Add model to wrapper group, then group to scene
        brainMesh.add(brainModel);
        brainMesh.position.set(0, 0, 0); // Group stays at origin
        scene.add(brainMesh);

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

        // Fallback Brain - procedural generation with enhanced visuals
        brainMesh = new THREE.Group();

        // Main sphere with pink material and cyan emissive glow
        const mainGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const mainMaterial = createBrainMaterial();
        mainMaterial.emissive = new THREE.Color(0x00f0ff);
        mainMaterial.emissiveIntensity = 0.4;
        const mainSphere = new THREE.Mesh(mainGeometry, mainMaterial);
        mainSphere.castShadow = true;
        mainSphere.receiveShadow = true;
        brainMesh.add(mainSphere);

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
            shininess: 150,
            transparent: true,
            opacity: 0.95,
            emissive: color,
            emissiveIntensity: 0.3,
            specular: 0x00f0ff,
            reflectivity: 0.8
          });
          const sphere = new THREE.Mesh(geometry, material);
          sphere.position.set(...pos);
          sphere.castShadow = true;
          sphere.receiveShadow = true;
          brainMesh.add(sphere);
        });

        scene.add(brainMesh);

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

    // Animation Loop - 60fps with brain rotation and effects
    let animationId;
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      if (brainMesh) {
        // Slow continuous Y-axis rotation
        brainMesh.rotation.y += 0.003;

        // Breathing/Pulsing animation - subtle scale oscillation
        const pulseScale = 1 + Math.sin(time * 0.5) * 0.03; // ±3% size variation
        brainMesh.scale.set(pulseScale, pulseScale, pulseScale);

        // Animate emissive glow intensity (neural activity simulation)
        brainMesh.traverse((child) => {
          if (child.isMesh && child.material) {
            // Pulsing glow effect
            const glowIntensity = 0.3 + Math.sin(time * 0.8) * 0.15;
            child.material.emissiveIntensity = glowIntensity;

            // Subtle color shift in emissive (cyan to pink gradient)
            const colorShift = (Math.sin(time * 0.3) + 1) * 0.5; // 0 to 1
            child.material.emissive.setRGB(
              colorShift * 0.5, // Red channel
              0.94 * (1 - colorShift * 0.5), // Green channel
              1.0 * (1 - colorShift * 0.3)  // Blue channel (stays more cyan)
            );
          }
        });
      }

      // Rotate lights for dynamic shimmer effect
      if (pointLight) {
        pointLight.position.x = Math.cos(time * 0.2) * 3;
        pointLight.position.z = Math.sin(time * 0.2) * 3;
      }

      // Animate particles (neural connectivity)
      const positions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Update positions with velocities
        positions[i3] += particleVelocities[i].x;
        positions[i3 + 1] += particleVelocities[i].y;
        positions[i3 + 2] += particleVelocities[i].z;

        // Keep particles within bounds (spherical boundary)
        const dist = Math.sqrt(
          positions[i3] ** 2 +
          positions[i3 + 1] ** 2 +
          positions[i3 + 2] ** 2
        );

        if (dist > 5 || dist < 2.5) {
          // Reverse velocity if outside bounds
          particleVelocities[i].x *= -1;
          particleVelocities[i].y *= -1;
          particleVelocities[i].z *= -1;
        }

        // Add slight random wobble for organic feel
        positions[i3] += (Math.random() - 0.5) * 0.002;
        positions[i3 + 1] += (Math.random() - 0.5) * 0.002;
        positions[i3 + 2] += (Math.random() - 0.5) * 0.002;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Pulse particle opacity
      particlesMaterial.opacity = 0.4 + Math.sin(time * 0.5) * 0.2;

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

      // Dispose particle system
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
      if (particlesMaterial) {
        particlesMaterial.dispose();
      }
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
          Interactive Brain
        </h3>
        <p className="text-white/90 text-sm mt-1 drop-shadow-lg">
          {isLoading ? loadingStatus : 'Drag to rotate • Scroll to zoom'}
        </p>
      </div>
    </div>
  );
}