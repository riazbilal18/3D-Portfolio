// src/components/Interactive.jsx

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import Car from "./canvas/Car";
import Box from "./canvas/Box";
import { CameraController } from "./CameraController";
import { useNavigate } from "react-router-dom";

const backgroundColor = "#87CEEB";

const Ground = () => (
  <RigidBody type="fixed" colliders="cuboid">
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color={backgroundColor} />
    </mesh>
  </RigidBody>
);

const Interactive = () => {
  const carRef = useRef();
  const navigate = useNavigate(); // <-- Hook to navigate

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="w-full h-screen">
      {/* Exit Button */}
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 z-50 bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
      >
        Exit
      </button>
      <Canvas
        shadows
        camera={{ position: [0, 0, 0], fov: 120 }}
        style={{ background: backgroundColor }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} castShadow intensity={1.2} />

        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          <Car ref={carRef} />
          <Box position={[2, 0, 0]} />
        </Physics>

        {/* Camera follow system */}
        <CameraController targetRef={carRef} />
      </Canvas>
    </div>
  );
};

export default Interactive;
