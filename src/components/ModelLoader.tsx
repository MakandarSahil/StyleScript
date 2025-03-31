import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

interface Props {
  modelPath: string;
}

const ModelLoader: React.FC<Props> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);
  const [scale, setScale] = useState(0);
  
  useEffect(() => {
    setScale(0);
    const timeout = setTimeout(() => setScale(1), 300);
    return () => clearTimeout(timeout);
  }, [modelPath]);

  return (
    <primitive 
      object={scene} 
      scale={scale}
      position={[0, -1, 0]}
    />
  );
};

export default ModelLoader;