import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceSearch = ({ onSearchComplete }) => {
  const [listening, setListening] = useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Google Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onSearchComplete) {
        onSearchComplete(transcript);
      }
      setListening(false);
    };

    recognition.onerror = (error) => {
      console.error('Speech recognition error:', error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <button
      onClick={startVoiceSearch}
      type="button"
      title="Voice Crop Search"
      style={{
        background: listening ? 'var(--danger)' : 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: listening ? '0 0 12px var(--danger)' : 'var(--shadow-sm)',
        transition: 'var(--transition)'
      }}
    >
      {listening ? <MicOff size={18} className="pulse" /> : <Mic size={18} />}
    </button>
  );
};

export default VoiceSearch;
