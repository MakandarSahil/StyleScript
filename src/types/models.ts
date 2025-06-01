import { createModel3D } from "../context/ModelContext";

export const availableModels = [
  createModel3D(
    "shirt_full", // ID
    "Full Shirt", // Display name
    "shirt_full.glb", // Model filename in public/assets/models/
    "shirt_thumbnail.jpg", // Optional thumbnail (create one and add to public/assets/thumbnails/)
    {
      scale: 1, // Adjust as needed
      position: [0, -0.5, 0], // Adjust positioning
      rotation: [0, 0, 0], // Adjust rotation if needed
    }
  ),
  // Add more models as needed
  // createModel3D('pants1', 'Denim Pants', 'pants.glb', 'pants-thumbnail.jpg', {...}),
];
