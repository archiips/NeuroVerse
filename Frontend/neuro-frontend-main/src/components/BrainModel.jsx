import { useEffect, useRef, useState } from 'react';

const BrainModel = () => {
  const mountRef = useRef(null);
  const [status, setStatus] = useState('Starting...');

  useEffect(() => {
    let scene, camera, renderer, animationId;

    const init = async () => {
      try {
        setStatus('Loading Three.js...');

        // Import Three.js modules
        const THREE = await import('three');
        const { GLTFLoader } = await import('three-stdlib');
        const { OrbitControls } = await import('three-stdlib');

        setStatus('Setting up 3D scene...');

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        if (!mountRef.current) return;

        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00f0ff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;

        camera.position.set(0, 0, 5);

        setStatus('Loading brain model...');

        // Load GLB model
        const loader = new GLTFLoader();

        // Try different URLs for the brain model
        const possibleUrls = [
          './brain.glb',
          '/src/components/brain.glb',
          'src/components/brain.glb',
          new URL('./brain.glb', import.meta.url).href
        ];

        let brainUrl = possibleUrls[3]; // Start with import.meta.url approach
        console.log('Trying to load brain from:', brainUrl);

        loader.load(
          brainUrl,
          (gltf) => {
            setStatus('Brain loaded successfully!');
            const brain = gltf.scene;

            // Scale and position
            brain.scale.setScalar(2);
            brain.position.set(0, 0, 0);

            // Apply materials
            brain.traverse((child) => {
              if (child.isMesh) {
                child.material = new THREE.MeshPhongMaterial({
                  color: 0xff6b9d,
                  shininess: 100,
                  transparent: true,
                  opacity: 0.9,
                });
              }
            });

            scene.add(brain);
          },
          (progress) => {
            const percent = progress.total ? (progress.loaded / progress.total * 100).toFixed(0) : 0;
            setStatus(`Loading brain: ${percent}%`);
          },
          (error) => {
            console.error('GLB loading error:', error);
            setStatus('Creating fallback brain...');

            // Fallback brain
            const geometry = new THREE.SphereGeometry(1.5, 32, 32);
            const material = new THREE.MeshPhongMaterial({
              color: 0xff6b9d,
              shininess: 100,
              transparent: true,
              opacity: 0.8,
            });
            const fallbackBrain = new THREE.Mesh(geometry, material);
            scene.add(fallbackBrain);
            setStatus('Interactive brain ready!');
          }
        );

        // Animation loop
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();

      } catch (error) {
        console.error('Initialization error:', error);
        setStatus('Error: ' + error.message);
      }
    };

    init();

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="w-full aspect-square rounded-xl relative overflow-hidden shadow-xl shadow-primary/30">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
        <h3 className="text-lg font-bold text-white drop-shadow-lg mb-2">Interactive Brain Activity</h3>
        <p className="text-sm text-gray-200 drop-shadow-md">{status}</p>
      </div>
    </div>
  );
};

export default BrainModel;