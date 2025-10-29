
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { Button } from './components/Button';
import { Spinner } from './components/Spinner';
import { ImageIcon } from './components/icons/ImageIcon';
import { DownloadIcon } from './components/icons/DownloadIcon';
import { editImageWithPrompt } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { Part } from '@google/genai';


export default function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [editedImageUrl, setEditedImageUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setEditedImageUrl('');
    setError('');
  };

  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setEditedImageUrl('');

    try {
      const imagePart: Part = await fileToGenerativePart(originalImage);
      const resultBase64 = await editImageWithPrompt(imagePart, prompt);
      if (resultBase64) {
        setEditedImageUrl(`data:image/png;base64,${resultBase64}`);
      } else {
        setError('Failed to generate image. The model did not return image data.');
      }
    } catch (e: any) {
      console.error(e);
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="text-xl md:text-2xl font-semibold text-sky-400 mb-4">1. Upload Your Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>

          <div className="mb-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="text-xl md:text-2xl font-semibold text-sky-400 mb-4">2. Describe Your Edit</h2>
            <PromptInput 
              prompt={prompt} 
              setPrompt={setPrompt} 
              disabled={!originalImage || isLoading}
            />
          </div>

          <div className="text-center mb-8">
            <Button 
              onClick={handleGenerate} 
              disabled={!originalImage || !prompt || isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate New Image'}
            </Button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-300">Original</h3>
              <div className="aspect-square w-full bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden">
                {originalImageUrl ? (
                  <img src={originalImageUrl} alt="Original upload" className="object-contain h-full w-full" />
                ) : (
                  <div className="text-slate-500">
                    <ImageIcon className="h-24 w-24" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-300">Generated</h3>
              <div className="aspect-square w-full bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center overflow-hidden relative group">
                {isLoading ? (
                  <Spinner />
                ) : editedImageUrl ? (
                  <>
                    <img src={editedImageUrl} alt="Edited result" className="object-contain h-full w-full" />
                     <a
                      href={editedImageUrl}
                      download="generated-image.png"
                      className="absolute bottom-4 right-4 bg-sky-500 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
                      aria-label="Download generated image"
                    >
                      <DownloadIcon className="h-6 w-6" />
                    </a>
                  </>
                ) : (
                  <div className="text-slate-500">
                    <ImageIcon className="h-24 w-24" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
