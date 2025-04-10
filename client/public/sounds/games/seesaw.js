// Generate dynamic seesaw sounds with the Web Audio API
export function createSeesawMusic() {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create oscillator for playful melody
  const melodyOsc = audioContext.createOscillator();
  melodyOsc.type = 'sawtooth';
  melodyOsc.frequency.value = 320; // E4
  
  // Create gain node for melody
  const melodyGain = audioContext.createGain();
  melodyGain.gain.value = 0.06;
  
  // Connect melody oscillator to gain
  melodyOsc.connect(melodyGain);
  
  // Create oscillator for bass
  const bassOsc = audioContext.createOscillator();
  bassOsc.type = 'square';
  bassOsc.frequency.value = 160; // E3
  
  // Create gain node for bass
  const bassGain = audioContext.createGain();
  bassGain.gain.value = 0.08;
  
  // Connect bass oscillator to gain
  bassOsc.connect(bassGain);
  
  // Create filter for both
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1000;
  filter.Q.value = 5;
  
  // Connect gain nodes to filter
  melodyGain.connect(filter);
  bassGain.connect(filter);
  
  // Connect filter to destination
  filter.connect(audioContext.destination);
  
  // Start oscillators
  melodyOsc.start();
  bassOsc.start();
  
  // Create bouncy melody sequence
  const notes = [320, 380, 420, 380, 320, 260, 320, 380];
  let noteIndex = 0;
  
  // Bouncy rhythm effect
  const rhythm = [0.2, 0.1, 0.05, 0.1];
  let rhythmIndex = 0;
  
  // Play sequence
  const interval = setInterval(() => {
    melodyOsc.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
    melodyGain.gain.setValueAtTime(0.06 + rhythm[rhythmIndex], audioContext.currentTime);
    
    noteIndex = (noteIndex + 1) % notes.length;
    rhythmIndex = (rhythmIndex + 1) % rhythm.length;
  }, 250);
  
  // Return stop function
  return () => {
    clearInterval(interval);
    melodyOsc.stop();
    bassOsc.stop();
    audioContext.close();
  };
}