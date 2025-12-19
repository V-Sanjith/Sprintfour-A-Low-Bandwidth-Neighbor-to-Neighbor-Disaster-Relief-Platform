import React, { useState } from 'react';

export default function VoiceInput({ onResult, placeholder }) {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setError('Voice input not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            setError('Error: ' + event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isListening ? 'var(--color-urgent)' : 'var(--color-surface-highlight)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    animation: isListening ? 'pulse 1s infinite' : 'none'
                }}
                title="Click to speak"
            >
                {isListening ? '🔴' : '🎤'}
            </button>
            {error && (
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-urgent)',
                    marginTop: '4px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}
