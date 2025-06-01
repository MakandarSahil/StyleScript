export interface ClothingItem {
  id: string;
  name: string;
  model: string;
  price: number;
  rating: number;
  tags: string[];
  isNew: boolean;
  colors: string[];
  colorNames: string[];
  description: string;
}

export interface CustomizationState {
  selectedColor: string;
  brightness: number;
  selectedSize: string;
  quantity: number;
}
