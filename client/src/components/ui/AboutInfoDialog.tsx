import React from 'react';
import { useStreetSign } from '../../lib/stores/useStreetSign';

interface AboutInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutInfoDialog: React.FC<AboutInfoDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-blue-800">About This Project</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          <section>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Michael R. Smith Portfolio Street</h3>
            <p className="text-gray-700">
              An interactive 3D portfolio website showcasing various projects in a playful cartoon street environment. 
              Navigate through the street to discover projects, interact with objects, and enjoy mini-games.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Technologies Used</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-gray-800">Frontend</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>React.js</li>
                  <li>TypeScript</li>
                  <li>Three.js / React Three Fiber</li>
                  <li>Tailwind CSS</li>
                  <li>Zustand (State Management)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">3D Graphics & Animation</h4>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Three.js</li>
                  <li>React Three Fiber</li>
                  <li>React Three Drei</li>
                  <li>GSAP (Animation)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">UI Design Components</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Shadcn/UI - Accessible component system</li>
              <li>Radix UI - Headless UI primitives</li>
              <li>Custom 3D sprite-based text rendering</li>
              <li>Interactive dialog components</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Features</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>3D character navigation with keyboard controls</li>
              <li>Animated character with dancing and waving abilities</li>
              <li>Interactive project houses with detailed information</li>
              <li>Mini-games: Tic-Tac-Toe, Hangman, and Checkers</li>
              <li>Dynamic camera system with look-around functionality</li>
              <li>Custom lighting for optimal visibility</li>
              <li>Activity-specific background music</li>
              <li>Immersive street environment with interactive objects</li>
            </ul>
          </section>

          <section className="border-t pt-4">
            <p className="text-gray-600 text-sm italic">
              This portfolio was developed using modern web technologies to create an engaging 
              and interactive showcase of projects. The 3D environment was carefully designed 
              to balance performance with visual appeal.
            </p>
          </section>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutInfoDialog;