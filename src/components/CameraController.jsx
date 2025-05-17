import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const CameraController = ({ targetRef }) => {
  const { camera } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!targetRef.current) return;

    const target = targetRef.current.translation();
    const offset = new THREE.Vector3(0, 3, 7); // Behind and above

    vec.current.set(target.x, target.y, target.z).add(offset);

    camera.position.lerp(vec.current, 0.1);
    camera.lookAt(target.x, target.y, target.z);
  });

  return null;
};
