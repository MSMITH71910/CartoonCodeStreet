// Generate dynamic fountain sounds with the Web Audio API
export function createFountainMusic() {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create noise for water sound
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  // Create noise source
  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  
  // Create biquad filter for water sound
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 500;
  filter.Q.value = 1;
  
  // Create gain node for water sound
  const waterGain = audioContext.createGain();
  waterGain.gain.value = 0.1;
  
  // Connect noise to filter to gain
  noise.connect(filter);
  filter.connect(waterGain);
  
  // Create oscillator for ambient tones
  const ambientOsc = audioContext.createOscillator();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = 200;
  
  // Create gain node for ambient tones
  const ambientGain = audioContext.createGain();
  ambientGain.gain.value = 0.05;
  
  // Connect ambient oscillator to gain
  ambientOsc.connect(ambientGain);
  
  // Connect both gain nodes to destination
  waterGain.connect(audioContext.destination);
  ambientGain.connect(audioContext.destination);
  
  // Start sources
  noise.start();
  ambientOsc.start();
  
  // Modulate the ambient tone
  const lfo = audioContext.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1;
  
  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 50;
  
  lfo.connect(lfoGain);
  lfoGain.connect(ambientOsc.frequency);
  
  lfo.start();
  
  // Return stop function
  return () => {
    noise.stop();
    ambientOsc.stop();
    lfo.stop();
    audioContext.close();
  };
}