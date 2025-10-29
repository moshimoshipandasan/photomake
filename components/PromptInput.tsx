
import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, disabled }) => {
  return (
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="e.g., 'Add a retro filter', 'Make the background a futuristic city', 'Create a pop-art version'..."
      disabled={disabled}
      className="w-full h-28 p-4 bg-slate-900 border-2 border-slate-700 rounded-lg text-slate-300 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
    />
  );
};
