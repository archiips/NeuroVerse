import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

/**
 * BarChart3D - Ultra-modern, interactive 3D bar chart with Framer Motion & Three.js
 */
export default function BarChart3D({
  data = [],
  totalSubjects = 100,
  activeCategory = null,
  onBarClick = () => {}
}) {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState(null);
  const sceneRef = useRef(null);
  const barsRef = useRef([]);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const backgroundCanvasRef = useRef(null);
  const backgroundParticlesRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || data.length === 0) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1A1A1A);
    scene.fog = new THREE.Fog(0x1A1A1A, 20, 35);

    // Ambient particle system background
    const ambientParticleCount = 150;
    const ambientParticles = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientParticleCount * 3);
    const ambientColors = new Float32Array(ambientParticleCount * 3);
    const ambientVelocities = [];

    for (let i = 0; i < ambientParticleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 10;
      const height = Math.random() * 15 - 2;

      ambientPositions[i3] = Math.cos(angle) * radius;
      ambientPositions[i3 + 1] = height;
      ambientPositions[i3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color(0x58A6FF);
      ambientColors[i3] = color.r;
      ambientColors[i3 + 1] = color.g;
      ambientColors[i3 + 2] = color.b;

      ambientVelocities.push({
        angle: angle,
        speed: 0.1 + Math.random() * 0.2,
        radius: radius,
        verticalSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    ambientParticles.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    ambientParticles.setAttribute('color', new THREE.BufferAttribute(ambientColors, 3));

    const ambientParticleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const ambientParticleSystem = new THREE.Points(ambientParticles, ambientParticleMaterial);
    scene.add(ambientParticleSystem);
    backgroundParticlesRef.current = { geometry: ambientParticles, velocities: ambientVelocities };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 6, 10);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 7;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2.2;
    controls.target.set(0, 2, 0);
    controls.autoRotate = false;
    controls.update();

    // Lighting - bright and clear
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(6, 10, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    scene.add(mainLight);

    const blueLight = new THREE.DirectionalLight(0x58A6FF, 1.2);
    blueLight.position.set(-6, 8, -6);
    scene.add(blueLight);

    const accentLight = new THREE.PointLight(0x9ECFFF, 1.5, 30);
    accentLight.position.set(0, 8, 0);
    scene.add(accentLight);

    // Modern grid floor
    const gridSize = 16;
    const gridDivisions = 16;
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x58A6FF, 0x2a3340);
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Glowing floor circle
    const floorGeometry = new THREE.CircleGeometry(10, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0D1117,
      roughness: 0.4,
      metalness: 0.6,
      emissive: 0x58A6FF,
      emissiveIntensity: 0.05
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer glow ring
    const outerRingGeo = new THREE.RingGeometry(9.5, 11, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x58A6FF,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.01;
    scene.add(outerRing);

    // Color mapping
    const colorMap = {
      'bg-blue-500': 0x3B82F6,
      'bg-green-500': 0x10B981,
      'bg-red-500': 0xEF4444,
      'bg-purple-500': 0xA855F7,
      'bg-yellow-500': 0xF59E0B,
      'bg-pink-500': 0xEC4899
    };

    // Create bars
    const bars = [];
    const barWidth = 1.8;
    const barDepth = 1.8;
    const maxHeight = 7;
    const spacing = 4.0;
    const startX = -(data.length - 1) * spacing / 2;

    data.forEach((item, index) => {
      const barHeight = (item.count / totalSubjects) * maxHeight;
      const barColor = colorMap[item.color] || 0x58A6FF;
      const barX = startX + index * spacing;

      // Bar with rounded top
      const barGeometry = new THREE.BoxGeometry(barWidth, barHeight, barDepth, 1, 12, 1);

      // Round top edges
      const positions = barGeometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i);
        if (y > barHeight / 2 - 0.3) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const distFromEdge = Math.min(
            Math.abs(Math.abs(x) - barWidth / 2),
            Math.abs(Math.abs(z) - barDepth / 2)
          );
          const roundAmount = Math.min(distFromEdge, 0.2);
          positions.setY(i, y - (0.2 - roundAmount) * 0.5);
        }
      }
      barGeometry.computeVertexNormals();

      // Modern glass material
      const barMaterial = new THREE.MeshPhysicalMaterial({
        color: barColor,
        roughness: 0.15,
        metalness: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: barColor,
        emissiveIntensity: 0.25,
        transparent: true,
        opacity: 0.98,
        reflectivity: 1
      });

      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.set(barX, barHeight / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;

      bar.userData = {
        name: item.name,
        count: item.count,
        percentage: item.percentage,
        originalColor: barColor,
        originalHeight: barHeight,
        index: index,
        targetScale: 1,
        currentScale: 1,
        animationProgress: 0
      };

      scene.add(bar);
      bars.push(bar);

      // Base glow ring
      const ringGeo = new THREE.RingGeometry(0.7, 1.0, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: barColor,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(barX, 0.02, 0);
      ring.userData = { baseOpacity: 0.4, targetOpacity: 0.4 };
      scene.add(ring);
      bar.userData.ring = ring;

      // Base label - always visible
      const baseLabelCanvas = document.createElement('canvas');
      const baseCtx = baseLabelCanvas.getContext('2d');
      baseLabelCanvas.width = 512;
      baseLabelCanvas.height = 128;

      baseCtx.font = 'Bold 48px Arial';
      baseCtx.fillStyle = '#FFFFFF';
      baseCtx.textAlign = 'center';
      baseCtx.fillText(item.name, 256, 70);

      const baseLabelTexture = new THREE.CanvasTexture(baseLabelCanvas);
      const baseLabelMat = new THREE.SpriteMaterial({
        map: baseLabelTexture,
        transparent: true,
        opacity: 0.9
      });
      const baseLabel = new THREE.Sprite(baseLabelMat);
      baseLabel.position.set(barX, -0.7, 0);
      baseLabel.scale.set(2.5, 0.8, 1);
      scene.add(baseLabel);

      // Value label above bar - always visible
      const valueLabelCanvas = document.createElement('canvas');
      const valueCtx = valueLabelCanvas.getContext('2d');
      valueLabelCanvas.width = 256;
      valueLabelCanvas.height = 128;

      // Background
      valueCtx.fillStyle = 'rgba(88, 166, 255, 0.2)';
      valueCtx.fillRect(0, 0, 256, 128);
      valueCtx.strokeStyle = 'rgba(88, 166, 255, 0.7)';
      valueCtx.lineWidth = 3;
      valueCtx.strokeRect(3, 3, 250, 122);

      // Count
      valueCtx.font = 'Bold 40px Arial';
      valueCtx.fillStyle = '#FFFFFF';
      valueCtx.textAlign = 'center';
      valueCtx.fillText(item.count, 128, 60);

      // Percentage
      valueCtx.font = 'Bold 28px Arial';
      valueCtx.fillStyle = '#10B981';
      valueCtx.fillText(`${item.percentage}%`, 128, 100);

      const valueLabelTexture = new THREE.CanvasTexture(valueLabelCanvas);
      const valueLabelMat = new THREE.SpriteMaterial({
        map: valueLabelTexture,
        transparent: true,
        opacity: 0.95
      });
      const valueLabel = new THREE.Sprite(valueLabelMat);
      valueLabel.position.set(barX, barHeight + 1.2, 0);
      valueLabel.scale.set(1.8, 0.9, 1);
      scene.add(valueLabel);
      bar.userData.valueLabel = valueLabel;

      // Particle system
      const particleCount = 30;
      const particlesGeo = new THREE.BufferGeometry();
      const particlePos = new Float32Array(particleCount * 3);
      const particleVel = [];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 0.8;

        particlePos[i3] = barX + Math.cos(angle) * radius;
        particlePos[i3 + 1] = Math.random() * barHeight;
        particlePos[i3 + 2] = Math.sin(angle) * radius;

        particleVel.push({
          angle: angle,
          speed: 0.5 + Math.random() * 0.5,
          verticalSpeed: 0.3 + Math.random() * 0.3
        });
      }

      particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
      const particlesMat = new THREE.PointsMaterial({
        color: barColor,
        size: 0.08,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(particlesGeo, particlesMat);
      particles.userData = { velocities: particleVel, barX, barHeight, targetOpacity: 0 };
      scene.add(particles);
      bar.userData.particles = particles;
    });

    barsRef.current = bars;

    // Mouse interaction
    const handleMouseMove = (event) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(bars);

      if (intersects.length > 0) {
        const hoveredIndex = intersects[0].object.userData.index;
        setHoveredBar(hoveredIndex);
        mount.style.cursor = 'pointer';

        bars.forEach((bar, idx) => {
          if (idx === hoveredIndex) {
            bar.userData.targetScale = 1.15;
            bar.userData.ring.userData.targetOpacity = 0.8;
            bar.userData.particles.userData.targetOpacity = 0.8;
          } else {
            bar.userData.targetScale = 0.92;
            bar.userData.ring.userData.targetOpacity = 0.2;
            bar.userData.particles.userData.targetOpacity = 0;
          }
        });
      } else {
        setHoveredBar(null);
        mount.style.cursor = 'default';

        bars.forEach((bar) => {
          bar.userData.targetScale = 1;
          bar.userData.ring.userData.targetOpacity = 0.4;
          bar.userData.particles.userData.targetOpacity = 0;
        });
      }
    };

    const handleClick = (event) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(bars);

      if (intersects.length > 0) {
        onBarClick(intersects[0].object.userData.name);
      }
    };

    mount.addEventListener('mousemove', handleMouseMove);
    mount.addEventListener('click', handleClick);

    // Animation
    let animationFrameId;
    const clock = new THREE.Clock();
    let startTime = Date.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Animate bars
      bars.forEach((bar, idx) => {
        // Scale animation for hover
        const scaleDiff = bar.userData.targetScale - bar.userData.currentScale;
        bar.userData.currentScale += scaleDiff * 0.12;
        bar.scale.set(bar.userData.currentScale, bar.userData.currentScale, bar.userData.currentScale);

        // Glow pulse
        const basePulse = Math.sin(elapsed * 2 + idx * 0.8) * 0.08 + 0.25;
        const hoverBoost = idx === hoveredBar ? 0.5 : 0;
        bar.material.emissiveIntensity = basePulse + hoverBoost;

        // Ring animation
        const ring = bar.userData.ring;
        const ringOpacityDiff = ring.userData.targetOpacity - ring.material.opacity;
        ring.material.opacity += ringOpacityDiff * 0.1;
        ring.scale.set(
          1 + Math.sin(elapsed * 2 + idx) * 0.08,
          1 + Math.sin(elapsed * 2 + idx) * 0.08,
          1
        );

        // Particles
        const particles = bar.userData.particles;
        const particleOpacityDiff = particles.userData.targetOpacity - particles.material.opacity;
        particles.material.opacity += particleOpacityDiff * 0.1;

        if (particles.material.opacity > 0.01) {
          const positions = particles.geometry.attributes.position.array;
          const velocities = particles.userData.velocities;

          for (let i = 0; i < velocities.length; i++) {
            const i3 = i * 3;
            const vel = velocities[i];

            vel.angle += vel.speed * delta;
            positions[i3] = particles.userData.barX + Math.cos(vel.angle) * 0.8;
            positions[i3 + 2] = Math.sin(vel.angle) * 0.8;
            positions[i3 + 1] += vel.verticalSpeed * delta;

            if (positions[i3 + 1] > particles.userData.barHeight + 0.5) {
              positions[i3 + 1] = 0;
            }
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      });

      // Outer ring pulse
      outerRing.material.opacity = 0.15 + Math.sin(elapsed * 1.5) * 0.05;

      // Animate ambient background particles
      if (backgroundParticlesRef.current) {
        const positions = backgroundParticlesRef.current.geometry.attributes.position.array;
        const velocities = backgroundParticlesRef.current.velocities;

        for (let i = 0; i < velocities.length; i++) {
          const i3 = i * 3;
          const vel = velocities[i];

          vel.angle += vel.speed * delta;
          positions[i3] = Math.cos(vel.angle) * vel.radius;
          positions[i3 + 2] = Math.sin(vel.angle) * vel.radius;
          positions[i3 + 1] += vel.verticalSpeed;

          // Wrap vertical position
          if (positions[i3 + 1] > 13) {
            positions[i3 + 1] = -2;
          } else if (positions[i3 + 1] < -2) {
            positions[i3 + 1] = 13;
          }
        }
        backgroundParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    // Resize
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();
    setIsLoading(false);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();

      // Dispose ambient particles
      if (backgroundParticlesRef.current) {
        backgroundParticlesRef.current.geometry.dispose();
      }

      bars.forEach(bar => {
        bar.geometry.dispose();
        bar.material.dispose();
        if (bar.userData.particles) {
          bar.userData.particles.geometry.dispose();
          bar.userData.particles.material.dispose();
        }
      });

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [data, totalSubjects, onBarClick]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-eerie-black to-black">
      <div ref={mountRef} className="w-full h-full" />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-eerie-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-4 border-primary-blue/30 border-t-primary-blue rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 w-16 h-16 border-4 border-light-blue/20 border-b-light-blue rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.div
              className="mt-6 text-primary-blue font-semibold tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Loading Visualization...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed hover card with Framer Motion */}
      <AnimatePresence>
        {hoveredBar !== null && (
          <motion.div
            className="absolute top-4 right-4 bg-gradient-to-br from-dark-border via-dark-border to-eerie-black border-2 border-primary-blue rounded-xl px-6 py-5 shadow-2xl min-w-[280px] backdrop-blur-sm"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="px-3 py-1 bg-primary-blue/20 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-primary-blue text-xs font-bold uppercase tracking-wider">Category Details</span>
              </motion.div>
              <motion.div
                className="w-3 h-3 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            <motion.div
              className="mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-white font-bold text-2xl mb-1">{data[hoveredBar]?.name}</div>
              <div className="text-[#9dabb9] text-xs">Diagnosis Category</div>
            </motion.div>

            <div className="space-y-3">
              <motion.div
                className="flex items-end justify-between p-3 bg-eerie-black/50 rounded-lg border border-primary-blue/20"
                whileHover={{ scale: 1.02, borderColor: "rgba(88, 166, 255, 0.5)" }}
                transition={{ duration: 0.2 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div>
                  <div className="text-[#9dabb9] text-xs mb-1">Total Subjects</div>
                  <motion.div
                    className="text-white font-bold text-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {data[hoveredBar]?.count}
                  </motion.div>
                </div>
                <svg className="w-8 h-8 text-primary-blue/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-3 bg-eerie-black/50 rounded-lg border border-green-500/20"
                whileHover={{ scale: 1.02, borderColor: "rgba(16, 185, 129, 0.5)" }}
                transition={{ duration: 0.2 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div className="flex items-baseline gap-2">
                  <motion.span
                    className="text-green-500 font-bold text-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {data[hoveredBar]?.percentage}
                  </motion.span>
                  <span className="text-green-500 text-xl font-semibold">%</span>
                </div>
                <div className="text-right">
                  <div className="text-[#9dabb9] text-xs">of total</div>
                  <div className="text-white text-sm font-semibold">{data[hoveredBar]?.count}/{totalSubjects}</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-4 pt-4 border-t border-primary-blue/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-xs text-primary-blue">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span className="italic">Click bar to select this category</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
