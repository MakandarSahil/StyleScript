import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the type for your 3D model data
interface Model3D {
  id: string;
  name: string;
  modelPath: string; // Path to the 3D model file in assets
  thumbnailPath?: string; // Path to the thumbnail image
  scale?: number; // Optional scale factor for the model
  position?: [number, number, number]; // Optional position [x, y, z]
  rotation?: [number, number, number]; // Optional rotation [x, y, z]
  // Add any other 3D model-specific properties you need
}

interface ModelContextType {
  selectedModel: Model3D | null;
  setSelectedModel: (model: Model3D | null) => void;
  clearSelectedModel: () => void;
  // Add function to load model directly by ID if needed
  loadModelById: (id: string, availableModels: Model3D[]) => void;
}

// Create the context with a default value
const ModelContext = createContext<ModelContextType>({
  selectedModel: null,
  setSelectedModel: () => { },
  clearSelectedModel: () => { },
  loadModelById: () => { },
});

// Custom hook for using the model context
export const useModelContext = () => useContext(ModelContext);

interface ModelProviderProps {
  children: ReactNode;
}

export const ModelProvider: React.FC<ModelProviderProps> = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  const clearSelectedModel = () => {
    setSelectedModel(null);
  };

  const loadModelById = (id: string, availableModels: Model3D[]) => {
    const model = availableModels.find(m => m.id === id);
    if (model) {
      setSelectedModel(model);
    } else {
      console.warn(`Model with ID ${id} not found`);
    }
  };

  return (
    <ModelContext.Provider
      value={{
        selectedModel,
        setSelectedModel,
        clearSelectedModel,
        loadModelById,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

// Utility function to create model objects with proper asset paths
export function createModel3D(
  id: string,
  name: string,
  modelFileName: string,
  thumbnailFileName?: string,
  options?: Partial<Model3D>
): Model3D {
  return {
    id,
    name,
    modelPath: `/assets/models/${modelFileName}`,
    thumbnailPath: thumbnailFileName ? `/assets/thumbnails/${thumbnailFileName}` : undefined,
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    ...options,
  };
}