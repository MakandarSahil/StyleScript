"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Mesh, type Group } from "three"
import * as THREE from "three"

interface ModelLoaderProps {
  modelPath: string
  color: string
  scale?: number
  autoRotate?: boolean
}

// Preload the models
useGLTF.preload("/src/assets/models/shirt.glb")
useGLTF.preload("/src/assets/models/shirt2.glb")
useGLTF.preload("/src/assets/models/t-shirt.glb")

export function ModelLoader({ modelPath, color, scale = 2.5, autoRotate = false }: ModelLoaderProps) {
  const groupRef = useRef<Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Load the GLTF model
  const { scene, error } = useGLTF(modelPath)

  useEffect(() => {
    if (scene) {
      setModelLoaded(true)

      // Center the model
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      scene.position.sub(center)

      // Apply color to all meshes in the model
      scene.traverse((child) => {
        if (child instanceof Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => {
              if (material.color) {
                material.color.set(color)
              }
            })
          } else if (child.material.color) {
            child.material.color.set(color)
          }
        }
      })
    }
  }, [scene, color])

  // Auto rotation
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  if (error) {
    console.error("Error loading model:", error)
    // Fallback to simple geometry with proper sizing
    return (
      <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    )
  }

  if (!modelLoaded || !scene) {
    // Loading state with proper sizing
    return (
      <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.2]} />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.5} />
        </mesh>
      </group>
    )
  }

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      <primitive object={scene.clone()} />
    </group>
  )
}

// Error boundary for model loading
export function ModelErrorBoundary({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <mesh>
          <boxGeometry args={[1, 1.5, 0.3]} />
          <meshStandardMaterial color="#ff6b6b" />
        </mesh>
      )
    )
  }

  return <>{children}</>
}
