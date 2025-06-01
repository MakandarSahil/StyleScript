"use client"

import type React from "react"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, useProgress, Html, ContactShadows, useGLTF } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

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

function Model({ modelPath, color }: { modelPath: string; color: string }) {
  const [error, setError] = useState<Error | null>(null)
  const [gltf, setGltf] = useState<any>(null)

  console.log("modelPath", modelPath)

  useEffect(() => {
    let model
    try {
      model = useGLTF(modelPath, true) // Enable error handling
      setGltf(model)
    } catch (err) {
      try {
        model = useGLTF("/model/shirt2.glb")
        setGltf(model)
      } catch (fallbackErr) {
        setError(fallbackErr instanceof Error ? fallbackErr : new Error("Failed to load model"))
      }
    }
  }, [modelPath])

  useEffect(() => {
    if (gltf?.scene) {
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.color.set(color)
          child.material.needsUpdate = true
        }
      })
    }
  }, [color, gltf?.scene])

  if (error) {
    return (
      <Html center>
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">Model not available</div>
          <div className="text-6xl mb-2">👕</div>
          <div className="text-sm text-gray-500">3D preview unavailable</div>
        </div>
      </Html>
    )
  }

  return gltf ? <primitive object={gltf.scene} scale={[1.4, 1.4, 1.4]} position={[0, -0.9, 0]} /> : null
}

const ClothViewer: React.FC<Props> = ({ modelPath, color }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  console.log("modelPath", modelPath)

  return (
    <div className="relative w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[700px] bg-gradient-to-br from-white via-gray-100 to-sky-100 rounded-xl shadow-xl overflow-hidden">
      <Canvas camera={{ position: [0, 1.6, 3.2], fov: 32 }} shadows>
        <color attach="background" args={["#f9fafb"]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <spotLight position={[0, 5, 2]} angle={0.3} penumbra={1} intensity={1} castShadow />

        <Suspense fallback={<Loader />}>
          <Model modelPath={modelPath} color={color} />
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path>
            <path d="M17 12H7"></path>
            <path d="m11 8-4 4 4 4"></path>
          </svg>
          <span className="hidden sm:inline">Reset View</span>
        </button>
      </div>

      {/* Drag hint */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 text-xs sm:text-sm rounded-md shadow-md">
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Drag</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
            <path d="M18 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
            <path d="M16 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
            <path d="M10 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
          </svg>
          <span>to rotate</span>
        </div>
      </div>
    </div>
  )
}

export default ClothViewer
