import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei';
import ModelLoader from './ModelLoader';
import { Group } from 'three';

interface Props {
  sleeveType: 'full' | 'half';
  color: string;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

function RotatingModel({ isRotating, children }: { isRotating: boolean; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);
  
  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });
  
  return <group ref={groupRef}>{children}</group>;
}

const ClothViewer: React.FC<Props> = ({ sleeveType, color }) => {
  const [isRotating, setIsRotating] = useState(true);
  const modelPath = `/models/shirt_${sleeveType}.glb`;

  return (
    <div className="relative w-full h-96 rounded-lg bg-gray-50 shadow-inner">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 40 }}
        shadows
      >
        <color attach="background" args={['#f8fafc']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
        />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Suspense fallback={<Loader />}>
          <RotatingModel isRotating={isRotating}>
            <ModelLoader modelPath={modelPath} />
          </RotatingModel>
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      <button 
        onClick={() => setIsRotating(!isRotating)} 
        className="absolute bottom-4 right-4 bg-white px-3 py-2 text-sm rounded-md shadow hover:bg-gray-50 transition flex items-center gap-2"
      >
        {isRotating ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pause Rotation
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Rotation
          </>
        )}
      </button>
    </div>
  );
};

export default ClothViewer;