import ClothViewer from '@/components/ClothViewer';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/genrateImage/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [sleeveType, setSleeveType] = useState<'full' | 'half'>('full');
  const [color, setColor] = useState<string>('#3B82F6');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Additional logic for image generation would go here
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="h-full flex items-center justify-center bg-gray-50 p-4">
              <ClothViewer sleeveType={sleeveType} color={color} />
            </div>
          </div>
          
          <div className="p-8 md:w-1/2">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">3D Clothing Customizer</div>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Customize Your Shirt</h2>
            <p className="mt-2 text-gray-600">Adjust the options below to customize your shirt, then generate the image.</p>
            
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Sleeve Style</label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`
                      border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase
                      ${sleeveType === 'full' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => setSleeveType('full')}
                  >
                    Full Sleeve
                  </button>
                  <button
                    type="button"
                    className={`
                      border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase
                      ${sleeveType === 'half' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}
                    `}
                    onClick={() => setSleeveType('half')}
                  >
                    Half Sleeve
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden">
                    <div style={{ backgroundColor: color }} className="w-full h-full"></div>
                  </div>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  className={`
                    w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
                  `}
                  onClick={handleGenerateImage}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Generate Image'
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">Instructions</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Drag to rotate the model</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Click the pause button to stop automatic rotation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteComponent;