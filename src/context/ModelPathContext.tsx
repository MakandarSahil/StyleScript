import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

// 1. Define the type of the context state
type ModelPathContextType = {
  modelPath: string
  setModelPath: (path: string) => void
}

// 2. Create the context with a default value
const ModelPathContext = createContext<ModelPathContextType | undefined>(undefined)

// 3. Provider component
export const ModelPathProvider = ({ children }: { children: ReactNode }) => {
  const [modelPath, setModelPath] = useState<string>("")

  return (
    <ModelPathContext.Provider value={{ modelPath, setModelPath }}>
      {children}
    </ModelPathContext.Provider>
  )
}

// 4. Custom hook for easier access
export const useModelPath = () => {
  const context = useContext(ModelPathContext)
  if (!context) {
    throw new Error("useModelPath must be used within a ModelPathProvider")
  }
  return context
}
