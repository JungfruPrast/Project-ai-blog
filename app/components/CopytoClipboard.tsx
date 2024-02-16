'use client'
import React, { useState } from 'react';

interface CopyToClipboardProps {
  textToCopy: string;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ textToCopy }) => {
  const [buttonText, setButtonText] = useState<string>('Copy');

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setButtonText('Copied!');
      setTimeout(() => setButtonText('Copy'), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button onClick={copyText} className="text-sm mr-2">
      {buttonText}
    </button>
  );
};

export default CopyToClipboard;
