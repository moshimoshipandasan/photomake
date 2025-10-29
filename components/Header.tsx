
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-800 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
          Gemini Image Stylist
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base">
          Transform your photos with the power of AI. Describe an edit, and let Gemini bring it to life.
        </p>
      </div>
    </header>
  );
};
