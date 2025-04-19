"use client"

import type React from "react"
import { Suspense, useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  OrbitControls,
  Environment,
  useProgress,
  Html,
  ContactShadows
} from "@react-three/drei"
import ModelLoader from "./ModelLoader"
import type { Group } from "three"
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
        <div className="w-20 h-20 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

function RotatingModel({ isRotating, children }: { isRotating: boolean; children: React.ReactNode }) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return <group ref={groupRef}>{children}</group>
}

const ClothViewer: React.FC<Props> = ({ modelPath, color }) => {
  const [isRotating, setIsRotating] = useState(true)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[700px] bg-gradient-to-br from-white via-gray-100 to-sky-100 rounded-xl shadow-xl overflow-hidden">
      <Canvas camera={{ position: [0, 1.5, 4.5], fov: 35 }} shadows>
        <color attach="background" args={["#f9fafb"]} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <spotLight position={[0, 10, 0]} intensity={0.5} castShadow />

        <Suspense fallback={<Loader />}>
          <RotatingModel isRotating={isRotating}>
            <ModelLoader color={color} modelPath={modelPath} scale={1.2} />
          </RotatingModel>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          minDistance={2.5}
          maxDistance={5.5}
        />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 sm:flex-row z-10">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="bg-white/90 hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg shadow-md flex items-center gap-2"
          title="Start/Stop auto-rotation"
        >
          {isRotating ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              <span className="hidden sm:inline">Pause</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span className="hidden sm:inline">Rotate</span>
            </>
          )}
        </button>

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
