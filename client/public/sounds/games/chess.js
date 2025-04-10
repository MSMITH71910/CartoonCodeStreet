// Generate dynamic sounds with the Web Audio API
export function createChessMusic() {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator for bass notes
  const bassOsc = audioContext.createOscillator();
  bassOsc.type = 'triangle';
  bassOsc.frequency.value = 220; // A3
  
  // Create gain node for bass
  const bassGain = audioContext.createGain();
  bassGain.gain.value = 0.3;
  
  // Connect bass oscillator to gain
  bassOsc.connect(bassGain);
  
  // Create oscillator for melody
  const melodyOsc = audioContext.createOscillator();
  melodyOsc.type = 'sine';
  melodyOsc.frequency.value = 440; // A4
  
  // Create gain node for melody
  const melodyGain = audioContext.createGain();
  melodyGain.gain.value = 0.2;
  
  // Connect melody oscillator to gain
  melodyOsc.connect(melodyGain);
  
  // Connect both gain nodes to destination
  bassGain.connect(audioContext.destination);
  melodyGain.connect(audioContext.destination);
  
  // Start oscillators
  bassOsc.start();
  melodyOsc.start();
  
  // Create sequence for melody
  const notes = [440, 493.88, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88];
  let noteIndex = 0;
  
  // Play sequence
  const interval = setInterval(() => {
    melodyOsc.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
    noteIndex = (noteIndex + 1) % notes.length;
  }, 500);
  
  // Return stop function
  return () => {
    clearInterval(interval);
    bassOsc.stop();
    melodyOsc.stop();
    audioContext.close();
  };
}