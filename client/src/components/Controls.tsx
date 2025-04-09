import { useKeyboardControls } from "@react-three/drei";
import { ControlName } from "../lib/constants";

const Controls = () => {
  // Get keyboard control states
  const forward = useKeyboardControls((state) => state[ControlName.forward]);
  const backward = useKeyboardControls((state) => state[ControlName.backward]);
  const leftward = useKeyboardControls((state) => state[ControlName.leftward]);
  const rightward = useKeyboardControls((state) => state[ControlName.rightward]);
  const interact = useKeyboardControls((state) => state[ControlName.interact]);

  // Debug component to visualize active controls
  return (
    <div className="fixed bottom-5 right-5 bg-black bg-opacity-50 p-3 rounded text-white font-mono text-sm">
      <div>W/↑: {forward ? "✅" : "❌"}</div>
      <div>S/↓: {backward ? "✅" : "❌"}</div>
      <div>A/←: {leftward ? "✅" : "❌"}</div>
      <div>D/→: {rightward ? "✅" : "❌"}</div>
      <div>E/Space: {interact ? "✅" : "❌"}</div>
    </div>
  );
};

export default Controls;
