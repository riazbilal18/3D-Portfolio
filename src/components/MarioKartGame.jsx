import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Text,
  Box,
  Sphere,
  Plane,
  useKeyboardControls,
  KeyboardControls,
  Html,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

// Keyboard controls mapping
const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "drift", keys: ["Space"] },
  { name: "reset", keys: ["KeyR"] },
  { name: "item", keys: ["KeyE"] },
];

// Enhanced Kart Component with Mario Kart styling
const MarioKart = ({ onPositionChange, onSpeedChange }) => {
  const kartRef = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Enhanced kart state
  const [velocity, setVelocity] = useState(new THREE.Vector3());
  const [isDrifting, setIsDrifting] = useState(false);
  const [driftDirection, setDriftDirection] = useState(0);
  const [miniTurbo, setMiniTurbo] = useState(0);
  const [speed, setSpeed] = useState(0);

  // Drift particles system
  const driftParticles = useRef([]);

  useFrame((state, delta) => {
    if (!kartRef.current) return;

    const { forward, backward, leftward, rightward, drift, reset, item } =
      getKeys();
    const kart = kartRef.current;

    // Enhanced physics constants
    const maxSpeed = 25;
    const acceleration = 35;
    const turnSpeed = 4;
    const friction = 0.88;
    const driftFriction = 0.75;
    const boostMultiplier = 1.5;

    // Reset functionality
    if (reset) {
      kart.setTranslation({ x: 0, y: 2, z: 0 });
      kart.setRotation({ x: 0, y: 0, z: 0, w: 1 });
      kart.setLinvel({ x: 0, y: 0, z: 0 });
      kart.setAngvel({ x: 0, y: 0, z: 0 });
      setVelocity(new THREE.Vector3());
      setIsDrifting(false);
      setMiniTurbo(0);
      return;
    }

    // Get current physics state
    const currentVel = kart.linvel();
    const currentAngVel = kart.angvel();
    const rotation = kart.rotation();
    const quaternion = new THREE.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );

    // Calculate directions
    const forwardDirection = new THREE.Vector3(0, 0, 1).applyQuaternion(
      quaternion
    );
    const rightDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(
      quaternion
    );

    let targetVelocity = new THREE.Vector3(
      currentVel.x,
      currentVel.y,
      currentVel.z
    );
    const currentSpeed = targetVelocity.length();
    setSpeed(currentSpeed);

    // Enhanced acceleration system
    if (forward) {
      const accelForce = forwardDirection
        .clone()
        .multiplyScalar(acceleration * delta);
      // Apply mini-turbo boost
      if (miniTurbo > 0) {
        accelForce.multiplyScalar(boostMultiplier);
        setMiniTurbo((prev) => Math.max(0, prev - delta * 2));
      }
      targetVelocity.add(accelForce);
    }

    if (backward) {
      const brakeForce = forwardDirection
        .clone()
        .multiplyScalar(-acceleration * 0.7 * delta);
      targetVelocity.add(brakeForce);
    }

    // Enhanced steering with speed dependency
    let targetAngularVel = currentAngVel.y;
    const speedFactor = Math.min(currentSpeed / 10, 1);

    if (currentSpeed > 0.5) {
      const steerStrength = turnSpeed * speedFactor * delta * 15;

      if (leftward) {
        targetAngularVel += steerStrength;
        setDriftDirection(-1);
      }
      if (rightward) {
        targetAngularVel -= steerStrength;
        setDriftDirection(1);
      }
    }

    // Advanced drift system
    if (drift && currentSpeed > 5) {
      if (!isDrifting) {
        setIsDrifting(true);
        setMiniTurbo(0);
      }

      // Drift physics
      targetVelocity.multiplyScalar(driftFriction);
      targetAngularVel *= 1.8; // Enhanced turning while drifting

      // Build mini-turbo
      if (Math.abs(targetAngularVel) > 0.1) {
        setMiniTurbo((prev) => Math.min(3, prev + delta * 2));
      }

      // Create drift particles
      if (Math.random() < 0.3) {
        const particlePos = kart.translation();
        const offset = rightDirection
          .clone()
          .multiplyScalar(driftDirection * 0.8);
        driftParticles.current.push({
          position: new THREE.Vector3(
            particlePos.x + offset.x,
            particlePos.y - 0.3,
            particlePos.z + offset.z - 1.5
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            Math.random() * 2,
            -Math.random() * 3
          ),
          life: 1.0,
          size: 0.1 + Math.random() * 0.1,
        });
      }
    } else {
      if (isDrifting) {
        // Release drift - trigger mini-turbo
        if (miniTurbo > 1) {
          const boostForce = forwardDirection.clone().multiplyScalar(15);
          targetVelocity.add(boostForce);
        }
        setIsDrifting(false);
      }
      targetVelocity.multiplyScalar(friction);
      targetAngularVel *= 0.85;
    }

    // Speed limiting
    if (targetVelocity.length() > maxSpeed) {
      targetVelocity.normalize().multiplyScalar(maxSpeed);
    }

    // Apply physics
    kart.setLinvel(targetVelocity);
    kart.setAngvel({
      x: 0,
      y: targetAngularVel,
      z: isDrifting ? Math.sin(state.clock.elapsedTime * 8) * 0.15 : 0,
    });

    // Update drift particles
    driftParticles.current = driftParticles.current.filter((particle) => {
      particle.life -= delta * 2;
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.velocity.y -= 9.8 * delta; // gravity
      particle.size *= 0.98;
      return particle.life > 0;
    });

    // Update camera position
    const position = kart.translation();
    onPositionChange(new THREE.Vector3(position.x, position.y, position.z));
    onSpeedChange(currentSpeed);
  });

  return (
    <RigidBody
      ref={kartRef}
      type="dynamic"
      position={[0, 2, 0]}
      canSleep={false}
      linearDamping={0.1}
      angularDamping={0.1}
    >
      <group>
        {/* Main kart body - Mario style */}
        <Box args={[1.4, 0.7, 2.5]} position={[0, 0.35, 0]}>
          <meshStandardMaterial
            color={
              isDrifting ? (miniTurbo > 2 ? "#ff6b35" : "#ff4757") : "#2ed573"
            }
            metalness={0.6}
            roughness={0.2}
            emissive={isDrifting && miniTurbo > 1.5 ? "#ff3333" : "#000000"}
            emissiveIntensity={isDrifting && miniTurbo > 1.5 ? 0.3 : 0}
          />
        </Box>

        {/* Kart details */}
        <Box args={[1.2, 0.3, 0.8]} position={[0, 0.7, 0.5]}>
          <meshStandardMaterial color="#1e3799" />
        </Box>

        {/* Enhanced wheels with rotation */}
        {[
          [-0.8, -0.1, 1.0], // Front left
          [0.8, -0.1, 1.0], // Front right
          [-0.8, -0.1, -1.0], // Rear left
          [0.8, -0.1, -1.0], // Rear right
        ].map((pos, i) => (
          <group key={i} position={pos}>
            <Box args={[0.2, 0.5, 0.5]} rotation={[0, 0, speed * 0.1]}>
              <meshStandardMaterial color="#2c2c2c" />
            </Box>
            {/* Wheel rims */}
            <Sphere args={[0.2]} position={[pos[0] > 0 ? 0.11 : -0.11, 0, 0]}>
              <meshStandardMaterial
                color="#ffa502"
                metalness={0.8}
                roughness={0.1}
              />
            </Sphere>
          </group>
        ))}

        {/* Mario character */}
        <group position={[0, 0.9, 0.3]}>
          {/* Head */}
          <Sphere args={[0.3]}>
            <meshStandardMaterial color="#ffa502" />
          </Sphere>
          {/* Hat */}
          <Box args={[0.4, 0.15, 0.4]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#ff3838" />
          </Box>
          {/* Body */}
          <Box args={[0.4, 0.6, 0.3]} position={[0, -0.3, 0]}>
            <meshStandardMaterial color="#3742fa" />
          </Box>
        </group>

        {/* Exhaust pipes */}
        {[-0.4, 0.4].map((x, i) => (
          <Box key={i} args={[0.1, 0.1, 0.3]} position={[x, 0.2, -1.3]}>
            <meshStandardMaterial color="#666666" />
          </Box>
        ))}

        {/* Drift smoke particles */}
        {driftParticles.current.map((particle, i) => (
          <Sphere
            key={i}
            args={[particle.size]}
            position={particle.position.toArray()}
          >
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={particle.life * 0.6}
            />
          </Sphere>
        ))}

        {/* Mini-turbo effect */}
        {miniTurbo > 1.5 && (
          <group position={[0, 0, -1.5]}>
            {Array.from({ length: 12 }, (_, i) => (
              <Sphere
                key={i}
                args={[0.05]}
                position={[
                  (Math.random() - 0.5) * 2,
                  Math.random() * 0.5,
                  -Math.random() * 0.8,
                ]}
              >
                <meshBasicMaterial
                  color={miniTurbo > 2 ? "#ff6b35" : "#fffa65"}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            ))}
          </group>
        )}
      </group>

      <CuboidCollider args={[0.7, 0.35, 1.25]} />
    </RigidBody>
  );
};

// Enhanced Race Track
const MarioKartTrack = () => {
  return (
    <group>
      {/* Main grass ground */}
      <RigidBody type="fixed" position={[0, -1, 0]}>
        <Plane args={[300, 300]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#4a7c59" />
        </Plane>
        <CuboidCollider args={[150, 0.5, 150]} />
      </RigidBody>

      {/* Mario Kart style track */}
      <RigidBody type="fixed" position={[0, -0.48, 0]}>
        <Plane args={[120, 120]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#4a4a4a" />
        </Plane>
      </RigidBody>

      {/* Rainbow Road inspired checkered pattern */}
      {Array.from({ length: 24 }, (_, i) =>
        Array.from({ length: 24 }, (_, j) => {
          const isCheckered = (i + j) % 2 === 0;
          const x = (i - 12) * 5;
          const z = (j - 12) * 5;

          return (
            <mesh
              key={`${i}-${j}`}
              position={[x, -0.47, z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[4.8, 4.8]} />
              <meshStandardMaterial
                color={isCheckered ? "#666666" : "#888888"}
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
          );
        })
      )}

      {/* Mario-style barriers */}
      {[
        // Outer track boundaries
        { pos: [0, 1.5, 62], size: [120, 3, 2], color: "#ff6b35" },
        { pos: [0, 1.5, -62], size: [120, 3, 2], color: "#ff6b35" },
        { pos: [62, 1.5, 0], size: [2, 3, 120], color: "#ff6b35" },
        { pos: [-62, 1.5, 0], size: [2, 3, 120], color: "#ff6b35" },
      ].map((barrier, i) => (
        <RigidBody key={i} type="fixed" position={barrier.pos}>
          <Box args={barrier.size}>
            <meshStandardMaterial
              color={barrier.color}
              metalness={0.3}
              roughness={0.7}
            />
          </Box>
          <CuboidCollider args={barrier.size.map((s) => s / 2)} />
        </RigidBody>
      ))}

      {/* Mario-style obstacles and power-up blocks */}
      {[
        {
          pos: [20, 1, 20],
          size: [3, 2, 3],
          color: "#f39c12",
          type: "question",
        },
        { pos: [-25, 1, -15], size: [4, 2, 2], color: "#8b4513", type: "pipe" },
        { pos: [15, 1, -30], size: [2, 2, 4], color: "#27ae60", type: "pipe" },
        { pos: [-20, 1, 25], size: [3, 2, 3], color: "#e74c3c", type: "block" },
        { pos: [35, 1, 0], size: [2, 2, 2], color: "#f1c40f", type: "coin" },
        {
          pos: [-35, 1, -35],
          size: [3, 2, 3],
          color: "#9b59b6",
          type: "block",
        },
      ].map((obstacle, i) => (
        <RigidBody key={i} type="fixed" position={obstacle.pos}>
          <Box args={obstacle.size}>
            <meshStandardMaterial
              color={obstacle.color}
              metalness={obstacle.type === "coin" ? 0.8 : 0.2}
              roughness={obstacle.type === "coin" ? 0.1 : 0.8}
              emissive={obstacle.type === "question" ? "#f39c12" : "#000000"}
              emissiveIntensity={obstacle.type === "question" ? 0.2 : 0}
            />
          </Box>
          <CuboidCollider args={obstacle.size.map((s) => s / 2)} />

          {/* Question mark on question blocks */}
          {obstacle.type === "question" && (
            <Text
              position={[0, obstacle.size[1] / 2 + 0.1, 0]}
              fontSize={1}
              color="white"
              anchorX="center"
              anchorY="middle"
              rotation={[-Math.PI / 2, 0, 0]}
            >
              ?
            </Text>
          )}
        </RigidBody>
      ))}

      {/* Start/Finish line */}
      <mesh position={[0, -0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Checkered start line pattern */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[i - 6 + 0.5, -0.45, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.8, 1.8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#000000" : "#ffffff"} />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Camera System
const MarioKartCamera = ({ kartPosition, speed }) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (kartPosition) {
      // Dynamic camera based on speed
      const cameraDistance = 12 + speed * 0.3;
      const cameraHeight = 6 + speed * 0.1;

      targetPosition.current.set(
        kartPosition.x,
        kartPosition.y + cameraHeight,
        kartPosition.z - cameraDistance
      );

      targetLookAt.current.set(
        kartPosition.x,
        kartPosition.y + 2,
        kartPosition.z + 8
      );

      // Smooth camera movement
      camera.position.lerp(targetPosition.current, 0.08);
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
};

// Enhanced UI
const MarioKartUI = ({ onNavigate }) => {
  return (
    <>
      {/* Back button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onNavigate}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-all duration-300 font-bold text-lg shadow-lg transform hover:scale-105"
        >
          🏠 Back to Portfolio
        </button>
      </div>

      {/* Enhanced Controls */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-blue-900 to-blue-700 bg-opacity-90 text-white p-6 rounded-xl max-w-sm border-2 border-yellow-400">
        <h3 className="text-xl font-bold mb-4 text-yellow-300">
          🏎️ Mario Kart Controls
        </h3>
        <div className="text-sm space-y-2">
          <p>
            <kbd className="bg-red-600 px-3 py-1 rounded-md text-xs font-bold">
              W
            </kbd>{" "}
            <kbd className="bg-red-600 px-3 py-1 rounded-md text-xs font-bold">
              ↑
            </kbd>{" "}
            Accelerate
          </p>
          <p>
            <kbd className="bg-blue-600 px-3 py-1 rounded-md text-xs font-bold">
              A
            </kbd>{" "}
            <kbd className="bg-blue-600 px-3 py-1 rounded-md text-xs font-bold">
              ←
            </kbd>{" "}
            Turn Left
          </p>
          <p>
            <kbd className="bg-blue-600 px-3 py-1 rounded-md text-xs font-bold">
              D
            </kbd>{" "}
            <kbd className="bg-blue-600 px-3 py-1 rounded-md text-xs font-bold">
              →
            </kbd>{" "}
            Turn Right
          </p>
          <p>
            <kbd className="bg-gray-600 px-3 py-1 rounded-md text-xs font-bold">
              S
            </kbd>{" "}
            <kbd className="bg-gray-600 px-3 py-1 rounded-md text-xs font-bold">
              ↓
            </kbd>{" "}
            Reverse
          </p>
          <p>
            <kbd className="bg-yellow-600 px-3 py-1 rounded-md text-xs font-bold">
              SPACE
            </kbd>{" "}
            Drift (Hold for Mini-Turbo!)
          </p>
          <p>
            <kbd className="bg-green-600 px-3 py-1 rounded-md text-xs font-bold">
              R
            </kbd>{" "}
            Reset Position
          </p>
          <p>
            <kbd className="bg-purple-600 px-3 py-1 rounded-md text-xs font-bold">
              E
            </kbd>{" "}
            Use Item
          </p>
        </div>
      </div>

      {/* Game Title */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🏁 <span className="text-red-500">MARIO</span>{" "}
          <span className="text-blue-500">KART</span> 🏁
        </h1>
        <p className="text-lg text-yellow-300 font-semibold drop-shadow-md">
          🌟 Hold SPACE to drift and get Mini-Turbo boosts! 🌟
        </p>
      </div>
    </>
  );
};

// Loading Screen
const MarioKartLoading = () => (
  <Html center>
    <div className="text-center">
      <div className="text-6xl mb-4">🏎️</div>
      <div className="text-white text-2xl font-bold mb-2">
        Loading Mario Kart...
      </div>
      <div className="text-yellow-300 text-lg">Get ready to race!</div>
    </div>
  </Html>
);

// Main Game Scene
const MarioKartScene = () => {
  const [kartPosition, setKartPosition] = useState(new THREE.Vector3(0, 2, 0));
  const [speed, setSpeed] = useState(0);

  return (
    <KeyboardControls map={keyboardMap}>
      <MarioKartCamera kartPosition={kartPosition} speed={speed} />

      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[30, 30, 20]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#fffa65" />
      <spotLight
        position={[0, 20, 30]}
        angle={0.3}
        penumbra={0.5}
        intensity={1}
        castShadow
      />

      {/* Mario Kart Environment */}
      <Environment preset="park" />

      {/* Game Title in 3D */}
      <Text
        position={[0, 20, -40]}
        fontSize={6}
        color="#ff3838"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="#ffffff"
      >
        MARIO KART 3.JS
      </Text>

      {/* Physics World */}
      <Physics gravity={[0, -30, 0]} debug={false}>
        <MarioKartTrack />
        <MarioKart
          onPositionChange={setKartPosition}
          onSpeedChange={setSpeed}
        />
      </Physics>
    </KeyboardControls>
  );
};

// Main Component with WebGL Error Handling
const MarioKartGame = () => {
  const [webglError, setWebglError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef();

  // Simulate navigation function if not using React Router
  const handleNavigate = () => {
    // If using React Router, uncomment the following line and import useNavigate
    // const navigate = useNavigate();
    // navigate('/');

    // For now, just log or implement your navigation logic
    console.log("Navigate back to portfolio");
    window.location.href = "/"; // Simple navigation
  };

  useEffect(() => {
    // Check for WebGL support
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      setWebglError(true);
      return;
    }

    // WebGL Context Lost Handler
    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn("WebGL context lost. Attempting to restore...");
      setWebglError(true);
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored.");
      setWebglError(false);
    };

    const canvasElement = canvasRef.current?.querySelector("canvas");
    if (canvasElement) {
      canvasElement.addEventListener("webglcontextlost", handleContextLost);
      canvasElement.addEventListener(
        "webglcontextrestored",
        handleContextRestored
      );
    }

    // Simulate loading completion
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      if (canvasElement) {
        canvasElement.removeEventListener(
          "webglcontextlost",
          handleContextLost
        );
        canvasElement.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      }
    };
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-red-900 to-red-700 text-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-3xl font-bold mb-4">WebGL Context Lost</h2>
          <p className="text-xl mb-6">
            The 3D graphics context was lost. This can happen due to:
          </p>
          <ul className="text-left text-lg mb-6 space-y-2">
            <li>• Graphics driver issues</li>
            <li>• Too many browser tabs using WebGL</li>
            <li>• System resource limitations</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-xl font-bold transition-colors"
          >
            🔄 Reload Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className="w-full h-screen relative bg-gradient-to-b from-sky-400 via-sky-300 to-green-300"
    >
      <MarioKartUI onNavigate={handleNavigate} />

      <Canvas
        shadows
        camera={{ position: [0, 8, -15], fov: 75 }}
        style={{ width: "100vw", height: "100vh" }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor("#87CEEB");
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={<MarioKartLoading />}>
          <MarioKartScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default MarioKartGame;
