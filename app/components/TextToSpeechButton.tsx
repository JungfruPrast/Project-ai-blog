'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { CogIcon, ForwardIcon, PauseIcon, PlayIcon, ReplayIcon } from './Icons';


interface Block {
  _type: string;
  children?: { text: string }[];
  code?: string;
  alt?: string;
  style?: string;
}

interface TextToSpeechButtonProps {
  blocks: Block[];
}

//Logic for concatonating and seperating based on paragraphs by checking if there is a heading or space between words. Uses sanity block systems. 
const extractTextFromPortableText = (blocks: Block[]): string[] => {
  let segments = [];
  let currentSegment = '';

  blocks.forEach(block => {
    const isEmptyBlock = block._type === 'block' && (!block.children || block.children.length === 0 || block.children.every(child => !child.text.trim()));
    if (isEmptyBlock) {
      if (currentSegment.trim() !== '') {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
    } else if (block.style && ['h1', 'h2', 'h3', 'h4', 'h5'].includes(block.style)) {
      if (currentSegment.trim() !== '') {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
      const headingText = block.children?.map(child => child.text).join(' ') || '';
      segments.push(headingText);
    } else {
      const text = block.children?.map(child => child.text).join(' ') || '';
      currentSegment += ` ${text}`;
    }
  });

  if (currentSegment.trim() !== '') {
    segments.push(currentSegment.trim());
  }

  return segments;
};

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ blocks }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const segments = extractTextFromPortableText(blocks);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(0); 
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const speakSegment = useCallback((index: number) => {
    window.speechSynthesis.cancel(); // Ensure to stop any ongoing speech

    if (index < 0 || index >= segments.length) {
      setIsSpeaking(false); // Stop speaking if index is out of bounds
      return;
    }

    const utterance = new SpeechSynthesisUtterance(segments[index]);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices[voiceIndex]; // Apply selected voice
    utterance.rate = rate; // Apply speech rate    
    
    utterance.onend = () => {
      setCurrentSegmentIndex((currentIndex) => {
        if (currentIndex + 1 < segments.length) {
          speakSegment(currentIndex + 1);
        } else {
          setIsSpeaking(false);
        }
        return currentIndex + 1;
      });
    };
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [segments, voiceIndex, rate]);

  useEffect(() => {
    function updateVoices() {
      setVoices(window.speechSynthesis.getVoices());
    }
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices(); // Initial call in case voices are already loaded

    return () => {
      window.speechSynthesis.onvoiceschanged = null; // Clean up
    };
  }, []);

  useEffect(() => {
    // This function runs when the component mounts and the return function runs on unmount
    return () => {
      window.speechSynthesis.cancel(); // Cancel any speech synthesis when the component unmounts
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const togglePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume(); // If the speech synthesis was paused, resume it.
      } else {
        speakSegment(currentSegmentIndex); // If it wasn't speaking, start from the current segment.
      }
      setIsSpeaking(true);
    }
  };

  const handleNextClick = useCallback(debounce(() => {
    const nextIndex = currentSegmentIndex + 1 < segments.length ? currentSegmentIndex + 1 : currentSegmentIndex;
    setCurrentSegmentIndex(nextIndex);
    speakSegment(nextIndex);
  }, 300), [currentSegmentIndex, segments.length, speakSegment]);

  const handlePreviousClick = useCallback(debounce(() => {
    const prevIndex = currentSegmentIndex - 1 >= 0 ? currentSegmentIndex - 1 : 0;
    setCurrentSegmentIndex(prevIndex);
    speakSegment(prevIndex);
  }, 300), [currentSegmentIndex, speakSegment]);

  return (
    <div className="inline-flex items-center mt-2">
      {/* Replay, Play/Pause, Forward buttons */}
      <button onClick={handlePreviousClick} className="p-2">
        <ReplayIcon />
      </button>
  
      <button onClick={togglePlayPause} className="p-2">
        {isSpeaking ? <PauseIcon /> : <PlayIcon />}
      </button>
  
      <button onClick={handleNextClick} className="p-2">
        <ForwardIcon />
      </button>
  
      
    </div>
  );
}

export default TextToSpeechButton;

//adds ms delay to correctly load array of segmented text
function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<F>) {
    const later = () => {
      clearTimeout(timeout!);
      func(...args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  }}