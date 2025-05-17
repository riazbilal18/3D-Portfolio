import React from "react";

export const Box = (props) => {
  return (
    <mesh {...props} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default Box;
