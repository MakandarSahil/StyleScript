import type React from 'react';
import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

interface Props {
  modelPath: string;
  color: string;
  scale?: number;
  onError?: (error: Error) => void;
}

const ModelLoader: React.FC<Props> = ({ modelPath, color, scale = 1, onError }) => {
  let scene;
  try {
    const gltf = useGLTF(modelPath);
    scene = gltf.scene;
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    return null;
  }

  const [modelScale, setModelScale] = useState(0);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.color.set(color);
        child.material.needsUpdate = true;
      }
    });
  }, [color, scene]);

  useEffect(() => {
    setModelScale(0);
    const timeout = setTimeout(() => setModelScale(scale), 300);
    return () => clearTimeout(timeout);
  }, [modelPath, scale]);

  return <primitive object={scene} scale={modelScale} position={[0, -0.8, 0]} castShadow receiveShadow />;
};

export default ModelLoader;