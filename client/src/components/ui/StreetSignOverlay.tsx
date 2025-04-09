import React from 'react';

interface StreetSignOverlayProps {
  visible: boolean;
  onClose: () => void;
  showDetails: boolean;
}

const StreetSignOverlay: React.FC<StreetSignOverlayProps> = ({ visible, onClose, showDetails }) => {
  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      style={{ pointerEvents: 'none' }}
    >
      {/* Sign Text - Always visible when near the sign */}
      <div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-800 p-4 rounded-lg border-4 border-white shadow-lg"
        style={{ pointerEvents: 'auto' }}
      >
        <h1 className="text-4xl font-bold text-yellow-300 text-center mb-2">PORTFOLIO STREET</h1>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Michael R. Smith</h2>
        <button 
          className="mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-xl border-2 border-white"
          onClick={() => onClose()}
        >
          {showDetails ? "Close Details" : "Show Details"}
        </button>
      </div>
      
      {/* Info Panel - Only visible when details are shown */}
      {showDetails && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg border-4 border-blue-500 max-w-3xl w-full shadow-2xl"
          style={{ pointerEvents: 'auto' }}>
          <h2 className="text-4xl font-bold text-yellow-300 text-center mb-6">About This Portfolio</h2>
          
          <div className="mb-6 bg-blue-700 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-white text-center">Core Technologies</h3>
          </div>
          
          <div className="mb-6 bg-white p-4 rounded-lg">
            <p className="text-xl text-black text-center">
              React • TypeScript • Three.js<br />
              @react-three/fiber • @react-three/drei<br />
              TailwindCSS • Express • Node.js
            </p>
          </div>
          
          <div className="mb-6 bg-gray-200 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-black text-center mb-2">3D Features</h3>
            <p className="text-xl text-black text-center">
              Custom lighting • Physics • Animations<br />
              Interactive objects • Dynamic camera
            </p>
          </div>
          
          <div className="mb-6 bg-green-600 p-4 rounded-lg">
            <h3 className="text-2xl font-bold text-white text-center">
              Interactive Mini-Games & Portfolio Showcase
            </h3>
          </div>
          
          <button 
            className="mx-auto block bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg text-xl border-2 border-white"
            onClick={() => onClose()}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default StreetSignOverlay;