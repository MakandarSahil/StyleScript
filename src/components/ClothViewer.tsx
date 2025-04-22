"use client"

import { Suspense, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  useProgress,
  Html,
  ContactShadows
} from "@react-three/drei"
import ModelLoader from "./ModelLoader"
import { OrbitControls as OrbitControlsImpl } from "three-stdlib"

interface Props {
  modelPath: string
  color: string
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-700">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

const ClothViewer: React.FC<Props> = ({ modelPath, color }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[700px] bg-gradient-to-br from-white via-gray-100 to-sky-100 rounded-xl shadow-xl overflow-hidden">
      <Canvas camera={{ position: [0, 1.6, 3.2], fov: 32 }} shadows>
        <color attach="background" args={["#f9fafb"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <spotLight position={[0, 5, 2]} angle={0.3} penumbra={1} intensity={1} castShadow />

        <Suspense fallback={<Loader />}>
          {/* Adjusted position and scale */}
          <group position={[0, -0.9, 0]} scale={[1.4, 1.4, 1.4]}>
            <ModelLoader color={color} modelPath={modelPath} />
          </group>

          <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={4.5} blur={2.8} far={5} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={2.4}
          maxDistance={5.2}
        />
      </Canvas>

      {/* Reset Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={() => controlsRef.current?.reset()}
          className="bg-white/90 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg shadow-md flex items-center gap-2"
          title="Reset camera view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path><path d="M17 12H7"></path><path d="m11 8-4 4 4 4"></path></svg>
          <span className="hidden sm:inline">Reset View</span>
        </button>
      </div>

      {/* Drag hint */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm rounded-md shadow-md">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Drag</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path><path d="M18 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path><path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path><path d="M16 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path><path d="M10 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path></svg>
          <span>to rotate</span>
        </div>
      </div>
    </div>
  )
}

export default ClothViewer
