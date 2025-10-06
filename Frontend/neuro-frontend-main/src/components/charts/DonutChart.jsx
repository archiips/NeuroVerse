import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/**
 * DonutChart - Ultra-modern, interactive donut chart with Framer Motion & Three.js
 *
 * @param {Array} data - Array of data objects with { name, count, percentage, color }
 * @param {number} totalSubjects - Total number of subjects
 * @param {string} activeCategory - Currently selected category
 * @param {function} onSegmentClick - Callback when a segment is clicked
 */
export default function DonutChart({
  data = [],
  totalSubjects = 100,
  activeCategory = null,
  onSegmentClick = () => {}
}) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  // Chart dimensions
  const size = 600;
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = 160;
  const innerRadius = 100;
  const hoverExpansion = 15;

  // Color mapping
  const colorMap = {
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-red-500': '#EF4444',
    'bg-purple-500': '#A855F7',
    'bg-yellow-500': '#F59E0B',
    'bg-pink-500': '#EC4899'
  };

  // Three.js background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0x000000, 0);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create particle system
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 4;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color(0x58A6FF);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 5;

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      particles.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Calculate segment paths
  const segments = useMemo(() => {
    let cumulativeAngle = -90;

    return data.map((item, index) => {
      const angle = (item.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const isHovered = hoveredSegment === index;
      const isSelected = selectedSegment === index;
      const radius = isHovered || isSelected ? outerRadius + hoverExpansion : outerRadius;

      // Outer arc points
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // Inner arc points
      const x3 = centerX + innerRadius * Math.cos(endRad);
      const y3 = centerY + innerRadius * Math.sin(endRad);
      const x4 = centerX + innerRadius * Math.cos(startRad);
      const y4 = centerY + innerRadius * Math.sin(startRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const path = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
        Z
      `;

      // Calculate label position
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const labelRadius = outerRadius + 50;
      const labelX = centerX + labelRadius * Math.cos(midRad);
      const labelY = centerY + labelRadius * Math.sin(midRad);

      cumulativeAngle = endAngle;

      return {
        path,
        color: colorMap[item.color] || '#58A6FF',
        name: item.name,
        count: item.count,
        percentage: item.percentage,
        labelX,
        labelY,
        midAngle,
        index
      };
    });
  }, [data, hoveredSegment, selectedSegment, centerX, centerY, outerRadius, innerRadius, hoverExpansion, colorMap]);

  const hoveredData = hoveredSegment !== null ? data[hoveredSegment] : null;

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment.index);
    onSegmentClick(segment.name);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Three.js background */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="absolute inset-0 m-auto"
        style={{ filter: 'blur(1px)' }}
      />

      {/* Main SVG */}
      <motion.svg
        width={size}
        height={size}
        className="relative z-10 drop-shadow-2xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Outer glow ring */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={outerRadius + 10}
          fill="none"
          stroke="#58A6FF"
          strokeWidth="2"
          opacity="0.2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />

        {/* Segments */}
        <AnimatePresence>
          {segments.map((segment, index) => (
            <motion.g
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <motion.path
                d={segment.path}
                fill={segment.color}
                stroke="#1A1A1A"
                strokeWidth="3"
                className="cursor-pointer"
                initial={{ opacity: 0.9 }}
                animate={{
                  opacity: hoveredSegment === null || hoveredSegment === index ? 0.95 : 0.4,
                  scale: hoveredSegment === index ? 1.02 : 1
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                style={{
                  filter: hoveredSegment === index
                    ? `drop-shadow(0 0 25px ${segment.color}) drop-shadow(0 0 10px ${segment.color})`
                    : selectedSegment === index
                    ? `drop-shadow(0 0 15px ${segment.color})`
                    : 'none',
                  transformOrigin: `${centerX}px ${centerY}px`
                }}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => handleSegmentClick(segment)}
              />

              {/* Animated pulse on hover */}
              {hoveredSegment === index && (
                <motion.path
                  d={segment.path}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="2"
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                />
              )}
            </motion.g>
          ))}
        </AnimatePresence>

        {/* Center circle background */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 5}
          fill="#0D1117"
          stroke="#58A6FF"
          strokeWidth="3"
          opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        />

        {/* Animated center glow */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 5}
          fill="none"
          stroke="#58A6FF"
          strokeWidth="2"
          opacity="0.3"
          animate={{
            r: [innerRadius - 5, innerRadius + 5, innerRadius - 5],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center text */}
        <AnimatePresence mode="wait">
          <motion.g
            key={hoveredData ? hoveredData.name : 'total'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <text
              x={centerX}
              y={centerY - 25}
              textAnchor="middle"
              fill="#9dabb9"
              fontSize="16"
              fontWeight="600"
            >
              {hoveredData ? hoveredData.name : 'Total Subjects'}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="48"
              fontWeight="bold"
            >
              {hoveredData ? hoveredData.count : totalSubjects}
            </text>
            {hoveredData && (
              <motion.text
                x={centerX}
                y={centerY + 45}
                textAnchor="middle"
                fill="#10B981"
                fontSize="28"
                fontWeight="bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                {hoveredData.percentage}%
              </motion.text>
            )}
          </motion.g>
        </AnimatePresence>

        {/* Segment labels */}
        {segments.map((segment, index) => {
          const isRight = segment.midAngle > -90 && segment.midAngle < 90;

          return (
            <motion.g
              key={`label-${index}`}
              initial={{ opacity: 0, x: isRight ? -20 : 20 }}
              animate={{
                opacity: hoveredSegment === null || hoveredSegment === index ? 1 : 0.3,
                x: 0
              }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            >
              {/* Leader line */}
              <motion.line
                x1={centerX + (outerRadius + 8) * Math.cos((segment.midAngle * Math.PI) / 180)}
                y1={centerY + (outerRadius + 8) * Math.sin((segment.midAngle * Math.PI) / 180)}
                x2={segment.labelX}
                y2={segment.labelY}
                stroke="#58A6FF"
                strokeWidth="2"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1 + 0.7, duration: 0.5 }}
              />

              {/* Label background */}
              <motion.rect
                x={isRight ? segment.labelX : segment.labelX - 85}
                y={segment.labelY - 32}
                width="85"
                height="60"
                fill="rgba(22, 27, 34, 0.95)"
                stroke="#58A6FF"
                strokeWidth="1.5"
                rx="6"
                whileHover={{ scale: 1.05, stroke: segment.color }}
                transition={{ duration: 0.2 }}
              />

              {/* Label text */}
              <text
                x={isRight ? segment.labelX + 42.5 : segment.labelX - 42.5}
                y={segment.labelY - 14}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="14"
                fontWeight="bold"
              >
                {segment.name}
              </text>
              <text
                x={isRight ? segment.labelX + 42.5 : segment.labelX - 42.5}
                y={segment.labelY + 3}
                textAnchor="middle"
                fill="#9dabb9"
                fontSize="12"
              >
                {segment.count}
              </text>
              <text
                x={isRight ? segment.labelX + 42.5 : segment.labelX - 42.5}
                y={segment.labelY + 19}
                textAnchor="middle"
                fill="#10B981"
                fontSize="13"
                fontWeight="bold"
              >
                {segment.percentage}%
              </text>
            </motion.g>
          );
        })}
      </motion.svg>

      {/* Hover card - matching 3D chart style */}
      <AnimatePresence>
        {hoveredSegment !== null && (
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
            </div>

            <motion.div
              className="mb-4"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-white font-bold text-2xl mb-1">{hoveredData?.name}</div>
              <div className="text-[#9dabb9] text-xs">Diagnosis Category</div>
            </motion.div>

            <div className="space-y-3">
              <motion.div
                className="flex items-end justify-between p-3 bg-eerie-black/50 rounded-lg border border-primary-blue/20"
                whileHover={{ scale: 1.02, borderColor: "rgba(88, 166, 255, 0.5)" }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <div className="text-[#9dabb9] text-xs mb-1">Total Subjects</div>
                  <motion.div
                    className="text-white font-bold text-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {hoveredData?.count}
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
              >
                <div className="flex items-baseline gap-2">
                  <motion.span
                    className="text-green-500 font-bold text-3xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {hoveredData?.percentage}
                  </motion.span>
                  <span className="text-green-500 text-xl font-semibold">%</span>
                </div>
                <div className="text-right">
                  <div className="text-[#9dabb9] text-xs">of total</div>
                  <div className="text-white text-sm font-semibold">{hoveredData?.count}/{totalSubjects}</div>
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
                <span className="italic">Click segment to select this category</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
