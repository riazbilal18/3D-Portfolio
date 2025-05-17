// src/components/canvas/Car.jsx

import React, { forwardRef, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Car = forwardRef((props, ref) => {
  const { scene } = useGLTF("./lowpolycarblue_gltf/scene.gltf");
  const rigidRef = useRef();

  const input = useRef({
    forward: false,
    back: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          input.current.forward = true;
          break;
        case "ArrowDown":
          input.current.back = true;
          break;
        case "ArrowLeft":
          input.current.left = true;
          break;
        case "ArrowRight":
          input.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case "ArrowUp":
          input.current.forward = false;
          break;
        case "ArrowDown":
          input.current.back = false;
          break;
        case "ArrowLeft":
          input.current.left = false;
          break;
        case "ArrowRight":
          input.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const car = rigidRef.current;
    if (!car) return;

    const speed = 5;
    const rotationSpeed = 2;

    // Get rotation as quaternion
    const rot = car.rotation();
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

    // Get direction the car is facing
    const forward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(quat)
      .normalize();

    // Apply forward/backward linear velocity
    let moveDir = 0;
    if (input.current.forward) moveDir = 1;
    else if (input.current.back) moveDir = -1;

    const velocity = forward.clone().multiplyScalar(moveDir * speed);
    car.setLinvel(
      {
        x: velocity.x,
        y: car.linvel().y, // preserve gravity
        z: velocity.z,
      },
      true
    );

    // Apply turning (angular velocity only when moving)
    let angularY = 0;
    if (moveDir !== 0) {
      if (input.current.left) angularY = rotationSpeed * moveDir;
      else if (input.current.right) angularY = -rotationSpeed * moveDir;
    }

    car.setAngvel({ x: 0, y: angularY, z: 0 }, true);
  });

  return (
    <RigidBody
      ref={(node) => {
        rigidRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      colliders="hull"
      mass={5}
      linearDamping={1}
      angularDamping={1.5}
    >
      <primitive object={scene} scale={0.5} position={[0, -0.3, 0]} />
    </RigidBody>
  );
});

export default Car;
