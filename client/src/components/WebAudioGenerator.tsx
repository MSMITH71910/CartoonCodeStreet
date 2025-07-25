import React, { useEffect, useRef } from 'react';
import { useAudio } from '../lib/stores/useAudio';

interface WebAudioGeneratorProps {
  activityType: string;
}

/**
 * WebAudioGenerator Component
 * 
 * This component uses the Web Audio API to generate completely different
 * procedural music tracks for each type of activity in the portfolio.
 * 
 * Unlike pre-recorded MP3s, this guarantees unique sounds for each activity.
 */
const WebAudioGenerator: React.FC<WebAudioGeneratorProps> = ({ activityType }) => {
  // Keep references to intervals and audio context for cleanup
  const audioContextRef = useRef<AudioContext | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  
  // Get audio state
  const { isMuted, isMusicMuted } = useAudio();
  
  // Set up and clean up audio generation
  useEffect(() => {
    console.log(`WebAudioGenerator: Setting up for ${activityType}`);
    
    // Don't generate audio if muted
    if (isMuted || isMusicMuted) {
      console.log('WebAudioGenerator: Audio is muted, not generating');
      return;
    }
    
    // Create audio context with TypeScript type safety
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;
    
    // Generate different music based on activity type
    let cleanupFunction: (() => void) | null = null;
    
    switch (activityType) {
      case 'background':
        cleanupFunction = generateBackgroundMusic(audioContext);
        break;
      case 'chess':
      case 'checkers':
      case 'ticTacToe':
      case 'hangman':
        cleanupFunction = generateBoardGameMusic(audioContext);
        break;
      case 'fountain':
        cleanupFunction = generateFountainMusic(audioContext);
        break;
      case 'seesaw':
        cleanupFunction = generatePlaygroundMusic(audioContext);
        break;
      default:
        console.log(`WebAudioGenerator: Unknown activity type: ${activityType}`);
        break;
    }
    
    // Store cleanup function
    cleanupFunctionRef.current = cleanupFunction;
    
    // Clean up function
    return () => {
      console.log(`WebAudioGenerator: Cleaning up for ${activityType}`);
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.error('WebAudioGenerator: Error closing audio context:', err);
        });
        audioContextRef.current = null;
      }
    };
  }, [activityType, isMuted, isMusicMuted]);
  
  // Component doesn't render anything visible
  return null;
};

// MUSIC GENERATORS - Each function creates completely different music

// Background - Calm ambient music with pentatonic scale
function generateBackgroundMusic(audioContext: AudioContext): () => void {
  console.log('WebAudioGenerator: Generating background music');
  
  // Pentatonic scale notes
  const pentatonicNotes = [523.25, 587.33, 659.25, 783.99, 880.00];
  
  // Create master gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioContext.destination);
  
  // Create a pad sound (ambient background)
  const padOsc = audioContext.createOscillator();
  padOsc.type = 'sine';
  padOsc.frequency.value = 220; // A3
  
  const padGain = audioContext.createGain();
  padGain.gain.value = 0.2;
  
  // Add some reverb-like effect with delay
  const delay = audioContext.createDelay();
  delay.delayTime.value = 0.5;
  
  const feedbackGain = audioContext.createGain();
  feedbackGain.gain.value = 0.3;
  
  // Connect the pad
  padOsc.connect(padGain);
  padGain.connect(masterGain);
  padGain.connect(delay);
  delay.connect(feedbackGain);
  feedbackGain.connect(delay);
  delay.connect(masterGain);
  
  // Add a subtle melody
  const melodyOsc = audioContext.createOscillator();
  melodyOsc.type = 'sine';
  
  const melodyGain = audioContext.createGain();
  melodyGain.gain.value = 0.1;
  
  melodyOsc.connect(melodyGain);
  melodyGain.connect(masterGain);
  
  // Start oscillators
  padOsc.start();
  melodyOsc.start();
  
  // Play gentle random melody from the pentatonic scale
  let currentNote = 0;
  const melodyInterval = setInterval(() => {
    // Random note from pentatonic scale
    currentNote = Math.floor(Math.random() * pentatonicNotes.length);
    melodyOsc.frequency.setValueAtTime(
      pentatonicNotes[currentNote], 
      audioContext.currentTime
    );
    
    // Gentle attack and release
    melodyGain.gain.setValueAtTime(0.01, audioContext.currentTime);
    melodyGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    melodyGain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 2.0);
  }, 3000); // Play a note every 3 seconds
  
  // Subtle LFO for pad modulation
  const lfo = audioContext.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // Very slow
  
  const lfoGain = audioContext.createGain();
  lfoGain.gain.value = 5;
  
  lfo.connect(lfoGain);
  lfoGain.connect(padOsc.frequency);
  lfo.start();
  
  // Return cleanup function
  return () => {
    clearInterval(melodyInterval);
    padOsc.stop();
    melodyOsc.stop();
    lfo.stop();
  };
}

// Board Game - Classical style with rhythm
function generateBoardGameMusic(audioContext: AudioContext): () => void {
  console.log('WebAudioGenerator: Generating board game music');
  
  // Master gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioContext.destination);
  
  // Classical melody
  const melodyOsc = audioContext.createOscillator();
  melodyOsc.type = 'triangle';
  
  const melodyGain = audioContext.createGain();
  melodyGain.gain.value = 0.2;
  
  // Accompaniment
  const chordOsc = audioContext.createOscillator();
  chordOsc.type = 'sine';
  
  const chordGain = audioContext.createGain();
  chordGain.gain.value = 0.15;
  
  // Connect
  melodyOsc.connect(melodyGain);
  melodyGain.connect(masterGain);
  
  chordOsc.connect(chordGain);
  chordGain.connect(masterGain);
  
  // Start
  melodyOsc.start();
  chordOsc.start();
  
  // Classical melody sequence (like a chess game)
  const melodyNotes = [
    // First phrase
    440, 493.88, 523.25, 587.33, 
    659.25, 587.33, 523.25, 493.88,
    
    // Second phrase  
    440, 392, 349.23, 329.63,
    293.66, 329.63, 349.23, 392
  ];
  
  // Chord sequence
  const chordNotes = [
    261.63, 261.63, 293.66, 293.66,
    329.63, 329.63, 293.66, 293.66,
    261.63, 246.94, 220, 220,
    195.99, 220, 246.94, 246.94
  ];
  
  let noteIndex = 0;
  
  // Play classical sequence
  const melodyInterval = setInterval(() => {
    // Update melody
    melodyOsc.frequency.setValueAtTime(
      melodyNotes[noteIndex], 
      audioContext.currentTime
    );
    
    // Update chord
    chordOsc.frequency.setValueAtTime(
      chordNotes[noteIndex], 
      audioContext.currentTime
    );
    
    // Classic articulation - note on/off pattern
    melodyGain.gain.setValueAtTime(0.2, audioContext.currentTime);
    melodyGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
    
    // Advance
    noteIndex = (noteIndex + 1) % melodyNotes.length;
  }, 400); // Moderate tempo
  
  // Return cleanup function
  return () => {
    clearInterval(melodyInterval);
    melodyOsc.stop();
    chordOsc.stop();
  };
}

// Fountain - Water ambient with harmonic tones
function generateFountainMusic(audioContext: AudioContext): () => void {
  console.log('WebAudioGenerator: Generating fountain music');
  
  // Master gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioContext.destination);
  
  // Create water sound (noise + filter)
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
  
  // Create water filter
  const waterFilter = audioContext.createBiquadFilter();
  waterFilter.type = 'bandpass';
  waterFilter.frequency.value = 1000;
  waterFilter.Q.value = 0.5;
  
  // Create water gain
  const waterGain = audioContext.createGain();
  waterGain.gain.value = 0.05;
  
  // Connect water elements
  noise.connect(waterFilter);
  waterFilter.connect(waterGain);
  waterGain.connect(masterGain);
  
  // Create harmonic tones (like singing bowls)
  const harmonicOsc1 = audioContext.createOscillator();
  harmonicOsc1.type = 'sine';
  harmonicOsc1.frequency.value = 174.61; // F3
  
  const harmonicOsc2 = audioContext.createOscillator();
  harmonicOsc2.type = 'sine';
  harmonicOsc2.frequency.value = 261.63; // C4
  
  // Harmonic gains
  const harmonicGain1 = audioContext.createGain();
  harmonicGain1.gain.value = 0.07;
  
  const harmonicGain2 = audioContext.createGain();
  harmonicGain2.gain.value = 0.05;
  
  // Connect harmonics
  harmonicOsc1.connect(harmonicGain1);
  harmonicGain1.connect(masterGain);
  
  harmonicOsc2.connect(harmonicGain2);
  harmonicGain2.connect(masterGain);
  
  // Create LFO for gentle ripples in water filter
  const filterLFO = audioContext.createOscillator();
  filterLFO.type = 'sine';
  filterLFO.frequency.value = 0.2;
  
  const filterLFOGain = audioContext.createGain();
  filterLFOGain.gain.value = 100;
  
  filterLFO.connect(filterLFOGain);
  filterLFOGain.connect(waterFilter.frequency);
  
  // Start everything
  noise.start();
  harmonicOsc1.start();
  harmonicOsc2.start();
  filterLFO.start();
  
  // Modulate harmonic tones gently
  const harmonicLFO = audioContext.createOscillator();
  harmonicLFO.type = 'sine';
  harmonicLFO.frequency.value = 0.05;
  
  const harmonicLFOGain = audioContext.createGain();
  harmonicLFOGain.gain.value = 1;
  
  harmonicLFO.connect(harmonicLFOGain);
  harmonicLFOGain.connect(harmonicGain1.gain);
  harmonicLFO.start();
  
  // Return cleanup function
  return () => {
    noise.stop();
    harmonicOsc1.stop();
    harmonicOsc2.stop();
    filterLFO.stop();
    harmonicLFO.stop();
  };
}

// Playground - Bouncy playful tune
function generatePlaygroundMusic(audioContext: AudioContext): () => void {
  console.log('WebAudioGenerator: Generating playground music');
  
  // Master gain
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.12;
  masterGain.connect(audioContext.destination);
  
  // Main bouncy melody
  const melodyOsc = audioContext.createOscillator();
  melodyOsc.type = 'square';
  
  // Filter for softer tone
  const melodyFilter = audioContext.createBiquadFilter();
  melodyFilter.type = 'lowpass';
  melodyFilter.frequency.value = 1200;
  melodyFilter.Q.value = 1;
  
  const melodyGain = audioContext.createGain();
  melodyGain.gain.value = 0.1;
  
  // Percussion (for bouncy rhythm)
  const percOsc = audioContext.createOscillator();
  percOsc.type = 'triangle';
  percOsc.frequency.value = 80;
  
  const percGain = audioContext.createGain();
  percGain.gain.value = 0;
  
  // Connect melody
  melodyOsc.connect(melodyFilter);
  melodyFilter.connect(melodyGain);
  melodyGain.connect(masterGain);
  
  // Connect percussion
  percOsc.connect(percGain);
  percGain.connect(masterGain);
  
  // Start oscillators
  melodyOsc.start();
  percOsc.start();
  
  // Playful melody pattern
  const melodyNotes = [
    523.25, 587.33, 659.25, 783.99, // C5, D5, E5, G5
    783.99, 659.25, 587.33, 523.25, // G5, E5, D5, C5
    523.25, 466.16, 392.00, 523.25, // C5, A#4, G4, C5
    587.33, 659.25, 587.33, 523.25  // D5, E5, D5, C5
  ];
  
  let noteIndex = 0;
  let percBeat = 0;
  
  // Play bouncy sequence
  const playgroundInterval = setInterval(() => {
    // Bouncy melody
    melodyOsc.frequency.setValueAtTime(
      melodyNotes[noteIndex], 
      audioContext.currentTime
    );
    
    // Melody envelope
    melodyGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    melodyGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.15);
    
    // Percussion on certain beats
    if (percBeat % 2 === 0) {
      percGain.gain.setValueAtTime(0.15, audioContext.currentTime);
      percGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    }
    
    // Advance
    noteIndex = (noteIndex + 1) % melodyNotes.length;
    percBeat = (percBeat + 1) % 4;
  }, 180); // Fast tempo
  
  // Return cleanup function
  return () => {
    clearInterval(playgroundInterval);
    melodyOsc.stop();
    percOsc.stop();
  };
}

export default WebAudioGenerator;