import React, { useState, useEffect } from 'react';
import './Terminal.css';

const Terminal = ({ text }) => {
  const [typedText, setTypedText] = useState('');
  const [completedTyping, setCompletedTyping] = useState(false);

  useEffect(() => {
    if (completedTyping) return;

    const typingTimeout = setTimeout(() => {
      if (typedText.length < text.length) {
        setTypedText(text.slice(0, typedText.length + 1));
      } else {
        setCompletedTyping(true);
      }
    }, 100);

    return () => clearTimeout(typingTimeout);
  }, [typedText, text, completedTyping]);

  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-button red"></div>
        <div className="terminal-button yellow"></div>
        <div className="terminal-button green"></div>
      </div>
      <div className="terminal-body">
        <span className="terminal-prompt">$</span>
        <span className="terminal-text">{typedText}</span>
        {!completedTyping && <span className="terminal-cursor"></span>}
      </div>
    </div>
  );
};

export default Terminal; 